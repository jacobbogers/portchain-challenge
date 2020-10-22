class Port {
    constructor(id, name){
        this.id = id;
        this.name = name;
       
    }
    equals(aPort){
        return this.id === aPort.id && this.name === aPort.name;
    }
    toString(){
        return `Port: ${this.id}_${this.name}`;
    }
}

module.exports = Port;