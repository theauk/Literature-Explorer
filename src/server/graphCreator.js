// Import the classes
let Edge = require("./objects/Edge");
let Node = require("./objects/Node");
const parser = require('js-sql-parser');

var mysql = require('mysql');
const {JSON: {stringify}} = require("mysql/lib/protocol/constants/types");

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
    con.query(`select title, doi from "NODE" FOR JSON `, function (err2,result){
        if (err2) throw err2 ;
        console.log (result);

    });
    con.query(`select title, doi from NODE `, function (err2,result){
        if (err2) throw err2 ;
        console.log (result);


    });



    //
    // let numberOfNodes = Math.floor(Math.random() * 20) + 1;

    // for (let i = 0; i < numberOfNodes; i++) {
    //     let newNode = new Node(i, "Paper " + i);
    //     nodes.push(newNode);
    // }
    //
    // for (let i = 0; i < Math.floor(Math.random() * 20) + 2; i++) {
    //     let newEdge = new Edge(i, Math.floor(Math.random() * numberOfNodes), Math.floor(Math.random() * numberOfNodes));
    //     edges.push(newEdge);
    // }
    //
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
