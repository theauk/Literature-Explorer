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

    network.on("click", function (params) {
        params.event = "[original event]";

        // Show the sidebar when a node is clicked
        var sidebar = document.getElementById("sidebar");
        sidebar.style.display = "block";

        // Update the sidebar with information about the clicked node 
        const paper = graphData['nodes'].find(element => element['id'] == this.getNodeAt(params.pointer.DOM));
        var sidebar = document.getElementById("paper-title").innerText = paper['label'];
        var sidebar = document.getElementById("paper-id").innerText = "ID " + paper['id'];

        console.log(
            "click event, getNodeAt returns node with ID: " + this.getNodeAt(params.pointer.DOM)
        );
    });
}

export { getGraph }