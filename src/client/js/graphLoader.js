// Track the last clicked node
let lastClickedPaperId = null;
var stack = [];
let idx = 0;

// Fetch the graph data from the backend
const getInitialGraph = async () => {
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
            lastClickedPaperId = data["nodes"][0].id
            createGraph(data);
            stack.push(data);
        })
        .catch(error => console.log(error))
}

// Fetch a graph based on an id
async function getNodeDataById (id) {
    let returnData;
    await fetch(`http://localhost:8080/getgraphbyID/${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json"
        }
    }).then(response => response.json())
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
    const allNodes = data;
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
                face: 'Montserrat',
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
            width: 1,
            length: 240,
        },
        manipulation: {
            enabled: false,
              addNode: function (data, callback) {
                  // filling in the popup DOM elements
                  console.log('add', data);
              },
              editNode: function (data, callback) {
                  // filling in the popup DOM elements
                  console.log('edit', data);
              },
              addEdge: function (data, callback) {
                  console.log('add edge', data);
                  if (data.from == data.to) {
                      var r = confirm("Do you want to connect the node to itself?");
                      if (r === true) {
                          callback(data);
                      }
                  }
                  else {
                      callback(data);
                  };
                  console.log("edges list new" + network.body.data["edges"].length);
                  network.addEdgeMode();
              }
          }
    };

    // Initialize the vis.js network
    let network = new vis.Network(container, data, options);
    
    function toggleButton(id, on_off, Class=null) {
        if (on_off == true){
            document.getElementById(id).className = Class; 
        }else{
            document.getElementById(id).className = "show"; 
        }
    };
    function check_next(){
        if(idx > 0 && idx <stack.length-1){
            toggleButton("next", true, "btn");
        }else{
            if(idx == 0){
                toggleButton("next", true, "btn");
            }else{
                toggleButton("next", true, "hidden");
            };
            
        }
    }
    function check_prev(){
        if(idx > 0){
            toggleButton("prev", true, "btn");
        }else{
            toggleButton("prev", true, "hidden");
        };
    };
    
    // Handle single clicks on nodes
    network.on("click", function (params) {
        params.event = "[original event]";

        // Update the sidebar with information about the clicked node
        const paperClicked = graphData['nodes'].find(element => element['id'] == this.getNodeAt(params.pointer.DOM));
        if (paperClicked != null) {
            document.getElementById("paper-title").innerText = paperClicked['label'];
            document.getElementById("paper-authors").innerHTML = "<b>Author(s): </b>" + paperClicked['authors'];
            document.getElementById("paper-date").innerHTML = "<b>Date Published: </b>" + paperClicked['date'];
            document.getElementById("paper-journal").innerHTML = "<b>Journal: </b>" + paperClicked['journal'];
            document.getElementById("paper-doi").innerHTML = "<b>DOI: </b>" + paperClicked['doi'];

            // Show the sidebar when a node is clicked
            const sidebar = document.getElementById("sidebar");
            sidebar.style.width = "250px";
        }
    });

    // Handle double clicks
    network.on("doubleClick", async function (params) {
// <<<<<<< HEAD
        params.event = "doubleClick"
        // Get node data
        const paperClicked = graphData['nodes'].find(element => element['id'] == this.getNodeAt(params.pointer.DOM));


        if (lastClickedPaperId !== paperClicked.id) {
            const newGraphData = await getNodeDataById(paperClicked.id);
            const newData = {
                nodes: newGraphData['nodes'],
                edges: newGraphData['edges'],
                mainPaper: paperClicked
            };
            network.setData(newData);
            graphData = newData;
            idx++;
            stack[idx] = graphData;
            stack = stack.slice(0, idx + 1);
        }
        check_prev();
        check_next();
        lastClickedPaperId = paperClicked.id;
    });

    document.getElementById("prev").addEventListener("click", () => {
        if (idx - 1 >= 0) {
            idx = idx - 1;
            const newGraphData = stack[idx];
            const newData = {
                nodes: newGraphData['nodes'],
                edges: newGraphData['edges'],
                mainPaper: newGraphData['mainPaper']
            };
            network.setData(newData);
            graphData = newData;
            //lastClickedPaperId = graphData['mainPaper'].id;
        }
        check_prev();
        check_next();
    });
    document.getElementById("next").addEventListener("click", () => {
        if ((idx + 1) < (stack.length)) {
            idx = idx + 1;
            const newGraphData = stack[idx];
            const newData = {
                nodes: newGraphData['nodes'],
                edges: newGraphData['edges'],
                mainPaper: newGraphData['mainPaper']
            };
            network.setData(newData);
            graphData = newData;
            //lastClickedPaperId = graphData['mainPaper'].id;
        };
        check_next();
        check_prev();
    });
    document.getElementById("userGraph").addEventListener("click", () => {
        let user_data = {
            nodes: allNodes["nodes"],
            edges: []
        };
        let currData = {nodes: [], edges: []};
        network.setData(currData);
        // set prev and next to hidden and show exit button
        toggleButton("Exit", false);
        toggleButton("userGraph", true, "hidden");
        toggleButton("prev", true, "hidden")
        toggleButton("next", true, "hidden");
        toggleButton("nodes", false);
        toggleButton("editmode", true, "editmode1");
        var selector = document.getElementById("nodes");
        user_data.nodes.forEach(node => {
            var option = document.createElement("option");
            
            option.value = node.id;
            option.innerHTML = node.id;
            selector.appendChild(option);
        });

        
        document.getElementById("nodes").addEventListener("change", (event) => {
            const val = document.getElementById("nodes").value;
            var node = user_data.nodes.find(node => node.id == val);
            currData["nodes"].push(node);
            currData["edges"] = network.body.data["edges"];
            toggleButton("editmode", true, "editmode1");
            network.setData(currData);
            
        });
        let flag = false;
        network.disableEditMode();
        function editmode(){
            //toggleButton("editmode", false, "editmode");
            if (currData["nodes"].length >=2 && flag == false){
                network.addEdgeMode();
                toggleButton("editmode", true, "editmode2");
                flag = true;
            }else{
                toggleButton("editmode", true, "editmode1");
                network.disableEditMode();
                flag = false;
            };
        }
        document.getElementById("editmode").addEventListener("click", () => {
        editmode();
        });
        document.getElementById("Exit").addEventListener("click", () => {
        toggleButton("Exit", true, "hidden");
        toggleButton("prev", true, "hidden");
        toggleButton("next", true, "hidden");
        toggleButton("userGraph", true, "btn2");
        toggleButton("nodes", true, "hidden");
        toggleButton("editmode", true, "hidden");
        document.getElementById("nodes").innerHTML = '';
        network.setData(allNodes);
        
    });
    });
}

export {getInitialGraph}