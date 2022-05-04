class Node {

    constructor(label, doi, journal,date, authors) {
        this.label =label;
        this.doi = doi;
        this.id=this.label
        this.journal = journal;
        this.date= date;
        this.authors = authors; // an array of authors
    }
}
module.exports = Node;