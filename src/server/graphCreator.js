// Import the classes
let Edge = require("./classes/Edge");
let Node = require("./classes/Node");
const mysql = require("mysql");
const {createConnection} = require("mysql");

// configs of the online hosted database which includes the online host, db_name, username and password
var db_config = {
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'bc5360b58be183',
    password: 'e7454ffc',
    database: 'heroku_88b6712d7c7d5a4'
}
var connection;

// await is repeatedly used in this context to asynchronously wait for the db queries to execute

// this function establish a connection to the database with the given configurations and reconnect as soon as the db disconneciton
function handleDisconnect() {
    connection = mysql.createConnection(db_config);
    connection.connect(err => { // makes a new connection
        if (err) {
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on('error', err => { // handles disconnection
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect(); // call the connection function

function fetchalledges() { // this function returns all the edges in the inital graph from the database
    let tempedges = [];
    return new Promise(resolve => {
        connection.query(`select source, destination
                          from edge `, (err2, result) => {

            if (err2) throw err2;
            Object.keys(result).forEach((key) => tempedges.push(new Edge(key, result[key].source, result[key].destination)));
            setTimeout(() => {
                resolve(tempedges)
            });
        })
    });
}

function getAuthors(title) { //returns an array of authors of a paper from the database, given the title of a paper
    return new Promise(
        resolve => {
            connection.query(`select author_name
                              from authors
                              where title = '${title}'`,
                (err, res) => {
                    if (err) throw err;
                    let ans = [];
                    res.forEach((i) => ans.push(i.author_name))
                    setTimeout(() => resolve(ans), 50);
                })
        }
    )
}

async function fetchAllNodes() { // returns all the nodes(papers) from the database with all their attributes
    let tempNodes = []

    return new Promise(resolve => {
        connection.query(`select *
                          from node`, async (err2, res) => {
            if (err2) throw err2;
            for (let i = 0; i < res.length; i++) {
                const authors = await getAuthors(res[i].title);
                tempNodes.push(new Node(res[i].title, res[i].doi, res[i].journal, res[i].publication_date, authors))
            }
            setTimeout(() => {
                resolve(tempNodes);
            }, 40)
        });
    });
}

async function getInitialGraph() { // returns all the nodes and edges from the database, whenever they are requested from the front end
    let nodes = []
    let edges = []
    nodes = await fetchAllNodes();
    edges = await fetchalledges();
    return {
        nodes: nodes,
        edges: edges,
        mainPaper: nodes[1]
    }
}

function fetchMainNode(title) { // fetch the node(paper) from the database given the title of the paper
    return new Promise(
        resolve => {
            connection.query(`select *
                              from node
                              where title = '${title}'`,

                (err, res) => {
                    setTimeout(async () => {
                        if (err) throw  err;
                        const authors = await getAuthors(title);
                        const result = new Node(title, res[0].doi, res[0].journal, res[0].publication_date, authors);
                        resolve(result);
                    }, 50);
                }
            )
        });
}

async function fetchConnectedNodes(mainodeTitle) { // fetch all the referncing papers (connected nodes) to a given node (paper) from the database
    return new Promise(
        async resolve => {
            connection.query(`select *
                              from node
                                       inner join edge on edge.destination = node.title
                              where edge.source = '${mainodeTitle}'`,
                async (err, res) => {

                    if (err) throw  err;
                    let tmp = [];
                    for (let i = 0; i < res.length; i++) {
                        const authors = await getAuthors(res[i].title);
                        tmp.push(new Node(res[i].title, res[i].doi, res[i].journal, res[i].publication_date, authors));
                    }
                    setTimeout(() => {
                        resolve(tmp);
                    }, 50)
                }
            )
        }
    )
}

// returns nodes and edges that is connected to (referencing) a given paper (node), given the title of the paper
async function getGraphDataId(paperTitle) {
    let nodes = [];
    let edges = [];
    let mainNode = await fetchMainNode(paperTitle);
    nodes.push(mainNode);
    let connectedNodes = await fetchConnectedNodes(paperTitle);
    connectedNodes.forEach((i) => nodes.push(i));
    for (let i = 1; i < nodes.length; i++) {
        edges.push(new Edge(i, paperTitle, nodes[i].id));
    }

    return {
        nodes: nodes,
        edges: edges,
        mainPaper: mainNode
    }
}

// export the functions needed by the client components
module.exports = {
    getInitialGraph,
    getGraphDataId
};

