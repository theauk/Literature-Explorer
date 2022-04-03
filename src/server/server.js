var path = require('path')
const cors = require('cors');
const express = require('express')
let graphFile = require("./graphCreator");
let graphData = graphFile.data;

const app = express()

app.use(express.static('dist'))

// For cross origin allowance
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.get('/', function (req, res) {
    res.sendFile(path.resolve('src/client/views/index.html'))
})

// Listen for incoming requests
app.listen(8080, function () {
    console.log('App listening on port 8080!')
})

// Get the graph data
app.get("/get-graph", (req, res) => {
    res.send(JSON.stringify(graphData));
});