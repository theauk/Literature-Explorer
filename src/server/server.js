// Necessary requirements for the server
var path = require('path')
const cors = require('cors');
const express = require('express')
const app = express()
app.use(express.static('dist'))

// Get the graph information from the external file
let graphFile = require("./graphCreator");
let graphData = graphFile.data;
let graphData_id = graphFile.data_id
// For cross origin allowance (so that the API works correctly)
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// Send the main page file to the frontend when the homepage is visited
app.get('/', function (req, res) {
    res.sendFile(path.resolve('src/client/views/index.html'))
})

// Listen for incoming requests on the server's port (8080)
app.listen(8080, function () {
    console.log('App listening on port 8080!')
})

// Get the graph data when the front end makes a GET request to /get-graph
app.get("/get-graph", (req, res) => {
    const id = req.query.val;
    if(req.query.val === ""){
        res.send(JSON.stringify(graphData));
    }else{
        res.send(JSON.stringify(data_id(id)));
    }
})