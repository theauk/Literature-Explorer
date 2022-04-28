// Track the last clicked node
let lastClickedPaperId = null;

const testTest = () => {
    return true
}

// Fetch the initial graph data from the backend
const getInitialGraph = () => {
    // API GET call to the backend
    fetch(`http://localhost:8080/get-graph`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            lastClickedPaperId = data["mainPaper"].id
            createGraph(data);
        })
        .catch(error => console.log(error))
}

// Fetch a graph based on an id
const getNodeDataById = async (id) => {
    let returnData;
    await fetch(`http://localhost:8080/get-graph?val=${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            lastClickedPaperId = id;
            returnData = data;
        })
        .catch(error => console.log(error));

    return returnData;
}

// Create the graph that should be displayed
const createGraph = (graphData) => {

    // Create a network and the data
    const container = document.getElementById('graph');
    const data = {
        nodes: graphData['nodes'],
        edges: graphData['edges']
    };

    // Set the styling options
    const options = {
        nodes: {
            shape: "circle",
            scaling: {
                min: 10,
                max: 30,
            },
            font: {
                size: 16,
                face: "Helvetica",
            },
            color: {
                border: '#000000',
                background: '#ede9da',
                border: '#87A980',
                highlight: {
                    border: '#378805',
                    background: '#87A980'
                },
            },
        },
        edges: {
            width: 0.15,
            length: 240,
        },
    };

    // Initialize the vis.js network
    let network = new vis.Network(container, data, options);

    // Handle single clicks on nodes
    network.on("click", function (params) {
        params.event = "[original event]";

        // Show the sidebar when a node is clicked
        const sidebar = document.getElementById("sidebar");
        sidebar.style.width = "250px";

        // Update the sidebar with information about the clicked node
        const paperClicked = graphData['nodes'].find(element => element['id'] == this.getNodeAt(params.pointer.DOM));
        if (paperClicked != null) {
            document.getElementById("paper-title").innerText = paperClicked['label'];
            document.getElementById("paper-id").innerText = "ID " + paperClicked['id'];
            document.getElementById("paper-authors").innerText = "Authors: ";
            document.getElementById("paper-year").innerText = "Year: ";
            document.getElementById("paper-references").innerText = "Number of references: ";
            document.getElementById("paper-description").innerText = "Description: ";
        }
    });

    // Handle double clicks
    network.on("doubleClick", async function (params) {
        params.event = "doubleClick"

        // Get node data
        const paperClicked = graphData['nodes'].find(element => element['id'] == this.getNodeAt(params.pointer.DOM));
        if (lastClickedPaperId != paperClicked.id) {
            const newGraphData = await getNodeDataById(paperClicked.id);
            const newData = {
                nodes: newGraphData['nodes'],
                edges: newGraphData['edges']
            };

            network.setData(newData);
            graphData = newData;
        }
        lastClickedPaperId = paperClicked.id;
    });
}

export {
    getInitialGraph,
    testTest
}