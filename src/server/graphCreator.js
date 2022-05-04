// Import the classes
let Edge = require("./classes/Edge");
let Node = require("./classes/Node");
const mysql = require("mysql");
const {createConnection} = require("mysql");

var db_config = {
    host:'us-cdbr-east-05.cleardb.net',
    user:'bc5360b58be183',
    password:'e7454ffc',
    database:'heroku_88b6712d7c7d5a4'
}
var connection;
function handleDisconnect() {
    connection = mysql.createConnection(db_config);
    connection.connect( err=> {
        if(err) {
            setTimeout(handleDisconnect, 2000);
        }
    });
    // handling error during connection, and reconnect
    connection.on('error', err=> {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();
mysql.createConnection({


});
// function myconnection () {
//     flag = true;
//     return new Promise (
//         resolve => {
//             connection.connect((err) =>{
//                     if (err) throw err;
//                     console.log("connected")
//                     setTimeout(() => {resolve("yes")},5)
//                 }
//             );
//         }
//     )
// }
function fetchalledges (){
    let tempedges = [];
    return new Promise(resolve => {
        connection.query(`select source , destination from edge `,  (err2,result)=>{

            if (err2) throw err2 ;
            Object.keys(result).forEach((key)=> tempedges.push(new Edge(key,result[key].source,result[key].destination)));
            setTimeout (()=>{
                resolve(tempedges)
            });})



    });

}
function getAuthors (title){
    return new Promise (
        resolve =>{
            connection.query(`select author_name from authors where title='${title}'`,
                (err,res)=>{
                    if (err) throw err;
                    let ans = [];
                    res.forEach((i)=>ans.push(i.author_name))
                    setTimeout (()=>resolve(ans),50);
                })
        }
    )
}
async function fetchAllNodes (){
    let tempnodes = []

    return new Promise(resolve => {
        connection.query(`select * from node`,  async(err2,res)=>{
            if (err2) throw err2 ;
            for (let i = 0; i < res.length; i++){
                const authors = await getAuthors(res[i].title);
                tempnodes.push (new Node(res[i].title,res[i].doi,res[i].journal,res[i].publication_date,authors))
            }
            setTimeout(()=>{
                resolve(tempnodes);
            } , 40)
        });});}

async function getInitialGraph()  {
    let nodes = []
    let edges = []
    nodes = await fetchAllNodes ();
    edges = await fetchalledges();
    return {
        nodes: nodes,
        edges: edges,
        mainPaper:nodes[1]
    }
}

function fetchMainNode(title) {
    return new Promise(
        resolve => {
            connection.query( `select * from node where title = '${title}'`,

                (err,res)=>{
                    setTimeout (async ()=>{
                        if (err) throw  err;
                        const authors = await getAuthors(title);
                        const result = new Node (title,res[0].doi,res[0].journal,res[0].publication_date,authors) ;
                        resolve(result);
                    },50);
                }
            )});
}
async function fetchConnectedNodes (mainodeTitle) {
    return new Promise(
        async resolve =>{
            connection.query(`select * from node inner join edge on edge.destination = node.title where edge.source = '${mainodeTitle}'`,
                async (err,res)=>{

                    if (err) throw  err;
                    let tmp = [];
                    for (let i = 0; i < res.length; i++) {
                        const authors = await  getAuthors(res[i].title);
                        tmp.push(new Node(res[i].title,res[i].doi,res[i].journal,res[i].publication_date,authors));
                    }
                    setTimeout (()=>{ resolve(tmp);
                    },50)
                }
            )
        }
    )


}
async function getGraphDataId (title) { // the function takes the doi and returns the paper and the papers connected to it
    let nodes = [];
    let edges = [];
    let mainNode = await fetchMainNode(title);
    nodes.push(mainNode);
    let connectedNodes = await fetchConnectedNodes(title);
    connectedNodes.forEach((i)=>nodes.push(i));
    for (let i=1; i<nodes.length; i++) {
        edges.push(new Edge(i,title,nodes[i].id));
    }


    return {
        nodes:nodes,
        edges:edges,
        mainPaper:mainNode
    }
}
module.exports = {
    getInitialGraph,
    getGraphDataId
};

getInitialGraph();