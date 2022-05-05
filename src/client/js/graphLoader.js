// Track the last clicked node
let lastClickedPaperId = null;
var stack = [];
let idx=0;

// Fetch the graph data from the backend
const getInitialGraph = () => {
    // API GET call to the backend
    await fetch(`http://localhost:8080/get-graph`, {
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
            stack.push(data);
        })
        .catch(error => console.log(error))
}

// Fetch a graph based on an id
const getNodeDataById = async (id) => {
    let returnData;
    await fetch(`http://localhost:8080/getgraphbyID/${id}`, {
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
            document.getElementById("paper-title").innerText = "DOI : " +paperClicked['doi'];
            document.getElementById("paper-id").innerText = "ID : " + paperClicked['label'];
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
                edges: newGraphData['edges'],
                mainPaper: paperClicked
            };

            network.setData(newData);
            graphData = newData;
            idx++;
            stack[idx]=graphData;
            stack=stack.slice(0,idx+1);
        }
        console.log("index" + idx);
        lastClickedPaperId = paperClicked.id;
        console.log(paperClicked.id);
    });
    document.getElementById("prev").addEventListener("click",() => {console.log("prev");
        if (idx-1 >= 0)
        {
            idx=idx-1;
            console.log("data" + stack[idx]);
            const newGraphData=stack[idx];
            const newData = {
                nodes: newGraphData['nodes'],
                edges: newGraphData['edges'],
                mainPaper: newGraphData['mainPaper']
            };
            network.setData(newData);
            graphData=newData;
            const paperClicked = graphData['mainPaper'].id;
            lastClickedPaperId = paperClicked;
            console.log("last clicked"+ lastClickedPaperId)
        }
    });
    document.getElementById("next").addEventListener("click",()=>{
        console.log("next");
        if ((idx+1) < (stack.length))
        {
            idx = idx+1;
            const newGraphData = stack[idx];
            const newData = {
                nodes: newGraphData['nodes'],
                edges: newGraphData['edges'],
                mainPaper: newGraphData['mainPaper']
            };
            network.setData(newData);
            graphData=newData;
            const paperClicked = graphData['mainPaper'].id;
            lastClickedPaperId = paperClicked;
            console.log("last clicked"+ lastClickedPaperId)
        }
    });
}

export {
    getInitialGraph
}