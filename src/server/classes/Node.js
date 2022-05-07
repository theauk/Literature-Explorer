class Node {

    constructor(label, doi, journal, date, authors) {
        this.label = label;
        this.doi = doi;
        this.id = this.label // TODO why are label and ID the same???
        this.journal = journal;
        this.date = date;
        this.authors = authors; // an array of authors
    }
}

module.exports = Node;