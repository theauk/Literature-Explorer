// Import the classes
let Edge = require("./objects/Edge");
let Node = require("./objects/Node");

const getGraphData = () => {
    // Dummy data creation – creates a random number of nodes and edges and connects nodes randomly
    let nodes = []
    let edges = []
    let mainNode = new Node(0, "Main Paper");
    nodes.push(mainNode);
    let numberOfNodes = Math.floor(Math.random() * 20) + 1;

    for (let i = 1; i < numberOfNodes; i++) {
        let newNode = new Node(i, "Paper " + i);
        nodes.push(newNode);
        let newEdge = new Edge(i, 0, i);
        edges.push(newEdge);
    }

    /*for (let i = 1; i < numberOfNodes; i++) {
        let newEdge = new Edge(i,0, i);
        edges.push(newEdge);
    }*/

    return {
        nodes: nodes,
        edges: edges
    }
}

const getGraphDataId = (id) =>{
    let nodes = []
    let edges = []
    console.log(id);
    let mainNode = new Node(id, "Paper " + id);
    nodes.push(mainNode);
    let numberOfNodes = Math.floor(Math.random() * 20) + 1;

    for (let i = 1; i < numberOfNodes; i++) {
        let newNode = new Node(i, "Paper " + i);
        nodes.push(newNode);
        let newEdge = new Edge(i, 0, i);
        edges.push(newEdge);
    }
    return {
        nodes: nodes,
        edges: edges
    }
};


let data = getGraphData();
let data_id = getGraphDataId(id);
// Export the data so that it can be used in server.js
module.exports = {
    data, 
    data_id
};
