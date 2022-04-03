let Edge = require("./objects/Edge");
let Node = require("./objects/Node");


const getGraphData = () => {
    // Dummy data creation
    let nodes = []
    let edges = []

    let numberOfNodes = Math.floor(Math.random() * 20) + 1;

    for (let i = 0; i < numberOfNodes; i++) {
        let newNode = new Node(i, "Paper " + i);
        nodes.push(newNode);
    }

    for (let i = 0; i < Math.floor(Math.random() * 20) + 2; i++) {
        let newEdge = new Edge(i, Math.floor(Math.random() * numberOfNodes), Math.floor(Math.random() * numberOfNodes));
        edges.push(newEdge);
    }

    return {
        nodes: nodes,
        edges: edges
    }
}

let data = getGraphData();

module.exports = {
    data
};
