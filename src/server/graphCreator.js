// Import the classes
let Edge = require("./objects/Edge");
let Node = require("./objects/Node");
const mysql = require("mysql");
const {createConnection} = require("mysql");
let flag = false;
var con = mysql.createConnection({
    host:'us-cdbr-east-05.cleardb.net',
    user:'bc5360b58be183',
    password:'e7454ffc',
    database:'heroku_88b6712d7c7d5a4'

});
function myconnection () {
    flag = true;
    return new Promise (
        resolve => {
            con.connect((err) =>{
                    if (err) throw err;
                    console.log("connected")
                    setTimeout(() => {resolve("yes")},5)
                }

            );
        }
    )
}
function fetchalledges (){
    let tempedges = [];
    return new Promise(resolve => {
      con.query(`select source , destination from edge `,  (err2,result)=>{

          if (err2) throw err2 ;
          Object.keys(result).forEach((key)=> tempedges.push(new Edge(key,result[key].source,result[key].destination)));
          setTimeout (()=>{
              resolve(tempedges)
                  });})



    });

}
function fetchallnodes (){
    tempnodes = []

    return new Promise(resolve => {
      con.query(`select title, doi from node`, function (err2,result){
        if (err2) throw err2 ;
        Object.keys(result).forEach(
             (key)=>  tempnodes.push (new Node(result[key].title,result[key].doi))
        );
        setTimeout(()=>{
            resolve(tempnodes);
        } , 40
        );

    });});
}
async function getRandomGraphData()  {
   nodes = []
   edges = []
    await myconnection();
    console.log("hello")
    nodes = await fetchallnodes ();
    console.log(nodes);
    edges = await fetchalledges();
    console.log("edges " );
    console.log(edges);
    return {
        nodes: nodes,
        edges: edges
    }
}


function fetchMainNode(title) {
    return new Promise(
        resolve => {
            con.query( `select node.doi from node where title = '${title}'`,

                (err,res)=>{
                    setTimeout (()=>{
                        if (err) throw  err;
                        const result = new Node (title,res[0].doi) ;
                        resolve(result);
                    },20);
                }
        )});
}
function fetchConnectedNodes (mainodeTitle) {
    return new Promise(
        resolve =>{
            con.query(`select title, doi from node inner join edge on edge.destination = node.title where edge.source = '${mainodeTitle}'`,
                (err,res)=>{
                    setTimeout (()=>{
                        if (err) throw  err;
                        let tmp = [];
                        Object.keys(res).forEach((i)=>{
                            tmp.push(new Node(res[i].title,res[i].doi));
                        })
                        resolve(tmp);
                    },50)
                }
                )
        }
    )


}
async function getGraphDataId (title) { // the function takes the doi and returns the paper and the papers connected to it
    let nodes = [] ;
    let edges = [];
    let mainnode = await fetchMainNode(title);
    nodes.push(mainnode);
    let connectedNodes = await fetchConnectedNodes(title);
    connectedNodes.forEach((i)=>nodes.push(i));
    for (let i=1; i<nodes.length; i++) {
        edges.push(new Edge(i,title,nodes[i].id));
    }

    return {
        nodes:nodes,
        edges:edges
    }

}
module.exports = {
    getRandomGraphData,
    getGraphDataId
};

