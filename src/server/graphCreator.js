// Import the classes
let Edge = require("./objects/Edge");
let Node = require("./objects/Node");

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fireandblood"
  ,database :"graph"
   // ,port : 3306
});

var connect = con.connect(function(err) {
  if (err) {throw err;}
  console.log("Connected!");
});

const getGraphData = () => {
    // Dummy data creation – creates a random number of nodes and edges and connects nodes randomly
    let nodes = []
    let edges = []

    // const st = parser.parse('select title, doi from NODE FOR JASON AUTO');
    // console.log(JSON.stringify(ast,null,2));
    con.query(`select title, doi from node`, function (err2,result){
        if (err2) throw err2 ;
        Object.keys(result).forEach(
            function (key) {
                let newnode = new Node(result[key].doi,result[key].title)

                nodes.push (newnode)

            }
        )
        // nodes = result
    });
    nodes.forEach((key) => console.log(nodes[key]))
    con.query(`select source , destination from edge `, function (err2,result){
        if (err2) throw err2 ;
        Object.keys(result).forEach(
            function (key) {
                newedge = new Edge(result[key].source,result[key].destination)
                edges.push(newedge)

            });

    });
    console.log(nodes.length)
    nodes.forEach((i)=>console.log(nodes[i].title + nodes[i].doi))

    let numberOfNodes = Math.floor(Math.random() * 20) + 1;

    for (let i = 0; i < numberOfNodes; i++) {
        let newNode = new Node(i, "Paper " + i);
        nodes.push(newNode);
    }

    for (let i = 0; i < Math.floor(Math.random() * 20) + 2; i++) {
        let newEdge = new Edge(i, Math.floor(Math.random() * numberOfNodes), Math.floor(Math.random() * numberOfNodes));
        edges.push(newEdge);
    }
    console.log(nodes.length)
    return {
        nodes: nodes,
        edges: edges
    }
}

let data = getGraphData();

// Export the data so that it can be used in server.js
module.exports = {
    data
};
