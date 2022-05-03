// Import the classes
let Edge = require("./objects/Edge");
let Node = require("./objects/Node");

const mysql = require("mysql");
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
var con = mysql.createConnection({

    host:'us-cdbr-east-05.cleardb.net',
    user:'bc5360b58be183',
    password:'e7454ffc',
    database:'heroku_88b6712d7c7d5a4'
    // ,port : 3306
});

const myconnectionc = con.connect(function(err) {
  if (err) {throw err;}
  console.log("Connected!");
});
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
tempnodes = []
tempedges = []
function selectalledgesquery_pormise (){
    return new Promise(resolve => {
      con.query(`select source , destination from edge `, function (err2,result){
        if (err2) throw err2 ;
        Object.keys(result).forEach(
            function (key) {
                let newedge = new Edge(key,result[key].source,result[key].destination)
                tempedges.push(newedge)
                // console.log(te.from)

            });

        setTimeout(()=>{
            console.log("from fetch all edges");
            resolve();
        ;} , 5000
        );
    });
    });
}

async function fetchalledges () {
   await(selectalledgesquery_pormise ());
   return tempedges;
}
function selectallnodesquery_promise (){
    return new Promise(resolve => {
      con.query(`select title, doi from node`, function (err2,result){
        if (err2) throw err2 ;
        Object.keys(result).forEach(
            function (key) {
                let newnode = new Node(result[key].title,result[key].doi);
                // console.log(newnode.id)
                tempnodes.push (newnode);
                // console.log(nodes.length)
            }
        );
        console.log("after fetch");
        setTimeout(()=>{
            console.log("from fetch all nodes");
            resolve();
        ;} , 5000
        );

    });});
}
async function fetchallnodes () {


    await (selectallnodesquery_promise());
    console.log("after fetch 1")
    return tempnodes ;
}
 const getRandomGraphData = async () => {
   nodes = []
   edges = []

    nodes = await fetchallnodes ();
    edges = await fetchalledges();

    // nodes.forEach((i)=>console.log(i.label));
    // edges.forEach((i)=> console.log(i.from + "   " + i.to));



    return {
        nodes: nodes,
        edges: edges
    }
}

let tmp_main_node ;
function fetch_main_node_promis(id){
    console.log("name of node is line 99 : " +id )
     return new Promise(resolve => {
      sql = `select node.doi from node where node.title='${id}'`;
      con.query(sql, function (err2,result){
        if (err2) throw err2 ;
        Object.keys(result).forEach(
            function (key) {
                tmp_main_node = result[key].title;
            });

    });
        setTimeout(()=>{
            console.log("mainnode fetched");
            resolve();
        ;} , 5000
        );

    });
}
async function fetch_main_node (id){
    await (fetch_main_node_promis(id));
    return tmp_main_node;
}



tmpConnectedNodes = []
function fetchConnectedNodes_promised (sourceNode) {
    return new Promise(resolve => {
        sqls = `select node.title, node.doi 
            from node inner join  edge on edge.destination = node.title
            where edge.source = '${sourceNode}'`;
        console.log("source node:" + sourceNode)
        con.query(sqls, function (err2,result){
            if (err2) throw err2 ;

            Object.keys(result).forEach(
                function (key) {
                    newNode = new Node(result[key].title, result[key].doi)
                    tmpConnectedNodes.push(newNode);

                });

        });
            setTimeout(()=>{
            console.log("connected nodes fetched");
            resolve();
        ;} , 5000
        );

    });
}
async function fetchConnectedNodes (sourceNode) {
    await (fetchConnectedNodes_promised(sourceNode));
    return tmpConnectedNodes;

}
const getGraphDataId = async(mainNodeName) =>{
    let nodes = []
    let edges = []
    console.log(mainNodeName)

    doi = await fetch_main_node(mainNodeName);
    console.log(doi);
    nodes.push(new Node (mainNodeName, doi)) ;// pushing the main node to the nodes array


    connectednode = await fetchConnectedNodes (mainNodeName) ;  // fetching the nodes connected to the main nodes
    counter = 0
    connectednode.forEach((i)=>{ // connect the edges between the main node and the connected nodess
        counter +=1
        newEdge = new Edge (counter,mainNodeName, i.id);
        console.log(newEdge.id + " " + newEdge.to + " " + newEdge.from);
        nodes.push(new Node (i.id , i.label));
        edges.push(newEdge);
    })
    console.log("nodes are ")
    nodes.forEach((i)=> console.log(i.id + "  "+ i.label))
    console.log("edges are")
    edges.forEach((i)=>console.log(i.id + "  " + i.from + "  " + i.to));
    return {

        nodes: nodes,
        edges: edges
    }
};

 getGraphDataId("paper 1");
module.exports = {
    getRandomGraphData,
    getGraphDataId
};
