// Fetch the graph data from the backend
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
            console.log(data)
            createGraph(data);
        })
        .catch(error => console.log(error))
}

const getNodeDataById = async (id) => {
    console.log("http://localhost:8080/get-graph?val=" + id);
    fetch("http://localhost:8080/get-graph?val=" + id, {
        method: "GET",
        mode: "cors",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("line 32 id: ", id + " data ", data);
            return data;
        })
        .catch(error => console.log(error))
}

const createGraph = (graphData) => {

    // Create a network
    const container = document.getElementById('graph');

    // Provide the data in the vis format
    const data = {
        nodes: graphData['nodes'],
        edges: graphData['edges']
    };

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


    // Initialize the network
    let network = new vis.Network(container, data, options);

    network.on("click", function (params) {
        params.event = "[original event]";

        // Show the sidebar when a node is clicked
        // const sidebar = document.getElementById("sidebar");
        sidebar.style.width = "250px";

        // Update the sidebar with information about the clicked node 
        const paper = graphData['nodes'].find(element => element['id'] == this.getNodeAt(params.pointer.DOM));
        // var sidebar = document.getElementById("paper-title").innerText = paper['label'];
        var sidebar = document.getElementById("paper-id").innerText = "ID " + paper['id'];
        // change attribute names here

        console.log(
            "click event, getNodeAt returns node with ID: " + this.getNodeAt(params.pointer.DOM)
        );
        const paperClicked = graphData['nodes'].find(element => element['id'] == this.getNodeAt(params.pointer.DOM));
        console.log(paperClicked);
        if (paperClicked != null) {
            document.getElementById("paper-title").innerText = paperClicked['label'];
            document.getElementById("paper-id").innerText = "ID " + paperClicked['id'];
        }
    });

    network.on("doubleClick", function (params) {
        params.event = "doubeclick"

        // get node data
        const paperClicked = graphData['nodes'].find(element => element['id'] == this.getNodeAt(params.pointer.DOM));
        const newGraphData = getNodeDataById(paperClicked);
        console.log("line 102, " + newGraphData)
        createGraph(newGraphData);
    });
}

export {getInitialGraph}