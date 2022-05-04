class Node {
    constructor(label, doi, journal,date, authors) {
        this.label =label;
        this.doi = doi;
        this.id=this.label
        this.journal = journal;
        this.date= (date.toString()).substring(4,15);
        console.log(this.date)
        this.authors = authors; // an array of authors
    }
}
module.exports = Node;