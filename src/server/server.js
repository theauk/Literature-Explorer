// Necessary requirements for the server
var path = require('path')
const cors = require('cors');
const express = require('express')
const app = express()
app.use(express.static('dist'))

// Get the graph information from the external file
let graphData = require("./graphCreator");

// For cross-origin allowance
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
const port = 8080;
const server = app.listen(port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening on port: ${port}`);
    }
});

// Get graph data for a general graph
app.get("/get-graph", async (req, res) => {
    res.send(JSON.stringify(await graphData.getInitialGraph()));
});

// Get graph data for a graph with a specific ID
app.get("/getgraphbyID/:id", async (req, res) => {
        const results = await graphData.getGraphDataId(req.params.id);
        res.send(JSON.stringify(results));
    }
);

// Endpoint for testing the server connection
app.get('/test', function (req, res) {
    res.send({"message": "working"});
})

module.exports = {server};
