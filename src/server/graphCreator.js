// Import the classes
let Edge = require("./classes/Edge");
let Node = require("./classes/Node");

const getRandomGraphData = () => {
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

    return {
        nodes: nodes,
        edges: edges
    }
};

const getGraphDataId = (id) =>{
    let nodes = []
    let edges = []
    console.log("ggdi 34", id);
    let mainNode = new Node(0, "Paper " + id);
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

module.exports = {
    getRandomGraphData,
    getGraphDataId
};
