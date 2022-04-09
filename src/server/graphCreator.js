// Import the classes
let Edge = require("./objects/Edge");
let Node = require("./objects/Node");

var mysql = require("mysql");
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fireandblood"
  ,database :"graph"
   // ,port : 3306
});

const myconnectionc = con.connect(function(err) {
  if (err) {throw err;}
  console.log("Connected!");
});
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


tempnodes = [] // tempprary  arrays
tempedges = []
function selectalledgesquery_pormise (){
    return new Promise(resolve => {
      con.query(`select source , destination from edge `, function (err2,result){
        if (err2) throw err2 ;
        Object.keys(result).forEach(
            function (key) {
                let newedge = new Edge(result[key].source,result[key].destination)
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
                let newnode = new Node(result[key].doi,result[key].title);
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

    nodes.forEach((i)=>console.log(i.label));
    edges.forEach((i)=> console.log(i.from + "   " + i.to));



    return {
        nodes: nodes,
        edges: edges
    }
}

let tmp_main_node ;
function fetch_main_node_promis(id){
     return new Promise(resolve => {
      sql = `select node.title from node where node.doi=${id}`;
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

        con.query(sqls, function (err2,result){
            if (err2) throw err2 ;
            Object.keys(result).forEach(
                function (key) {
                    newNode = new Node(result[key].doi,result[key].title)
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
const getGraphDataId = async(id) =>{
    let nodes = []
    let edges = []


    mainNodeName = await fetch_main_node(id);
    console.log(mainNodeName);
    nodes.push(new Node (id,mainNodeName)) ;// pushing the main node to the nodes array


    connectednode = await fetchConnectedNodes (mainNodeName) ;  // fetching the nodes connected to the main nodes
    connectednode.forEach((i)=>{ // connect the edges between the main node and the connected nodess
        newEdge = new Edge (mainNodeName, i.label);
        edges.push(newEdge);
    })

    edges.forEach((i)=>console.log(i.from + "  " + i.to));
    return {

        nodes: nodes,
        edges: edges
    }
};

getGraphDataId(123456789);
module.exports = {
    getRandomGraphData,
    getGraphDataId
};
