// Necessary requirements for the server
var path = require('path')
const cors = require('cors');
const express = require('express')
const app = express()
app.use(express.static('dist'))

// Get the graph information from the external file
let graphData = require("./graphCreator");

// For cross origin allowance (so that the API works correctly)
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});
// const port  = process.env.PORT ||  8080 ;
const port = 8080;
// Send the main page file to the frontend when the homepage is visited
app.get('/', function (req, res) {
    res.sendFile(path.resolve('src/client/views/index.html'))
})

// Listen for incoming requests on the server's port (8080)
app.listen(port,  ()=> console.log('App listening on port 8080!'));

// Get the graph data when the front end makes a GET request to /get-graph

app.get("/get-graph", async (req, res) => {
    console.log("server get")

    res.send(JSON.stringify(await graphData.getInitialGraph() ));}) ;

app.get("/getgraphbyID/:id", async (req,res)=>{
    console.log("entred serverID " + req.params.id) ;
    const results = await graphData.getGraphDataId(req.params.id);
    res.send(JSON.stringify(results)) ;}
);

