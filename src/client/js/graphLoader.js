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
    let returnData;
    console.log(`http://localhost:8080/get-graph?val=${id}`);
    await fetch(`http://localhost:8080/get-graph?val=${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data =>  {
            console.log("line 32 id: ", id + " data ", data);
            returnData = data;
        })
        .catch(error => console.log(error));

    return returnData;
}
const createGraph =  (graphData) => {

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
        const sidebar = document.getElementById("sidebar");
        sidebar.style.width = "250px";

        // Update the sidebar with information about the clicked node 
        const paperClicked = graphData['nodes'].find(element => element['id'] == this.getNodeAt(params.pointer.DOM));
        console.log(paperClicked);
        if (paperClicked != null) {
            document.getElementById("paper-title").innerText = paperClicked['label'];
            document.getElementById("paper-id").innerText = "ID " + paperClicked['id'];
        }
    });
    
    network.on("doubleClick", async function (params) {
        params.event = "doubeclick"
        // get node data
        const paperClicked =  graphData['nodes'].find(element => element['id'] == this.getNodeAt(params.pointer.DOM));
        console.log('w',paperClicked);
        const newGraphData = await getNodeDataById(paperClicked.id);
        console.log('niggers', newGraphData.edges);
        const newdata = {
            nodes: newGraphData['nodes'],
            edges: newGraphData['edges']
        };

        network.setData(newdata);
    });
}

export {getInitialGraph}