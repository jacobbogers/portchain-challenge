class Port {
    constructor(id, name){
        this.id = id;
        this.name = name;
       
    }
    toString(){
        return `Port: ${this.id}_${this.name}`;
    }
}

module.exports = Port;