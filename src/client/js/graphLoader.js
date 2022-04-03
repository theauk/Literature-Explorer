// Fetch the graph data from the backend
const getGraph = () => {
    // API GET call to the backend
    fetch("http://localhost:8080/get-graph", {
        method: "GET",
        mode: "cors",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            createGraph(data);
        })
        .catch(error => console.log(error))
}

const createGraph = (graphData) => {

    // Create a network
    var container = document.getElementById('graph');

    // Provide the data in the vis format
    var data = {
        nodes: graphData['nodes'],
        edges: graphData['edges']
    };
    var options = {};

    // Initialize the network
    var network = new vis.Network(container, data, options);
}

export { getGraph }