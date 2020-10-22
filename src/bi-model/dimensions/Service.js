class Service {
    constructor(name){
        this.name = name;
        this.vessels = new Map();
    }
    equals(aService){
        return this.name === aService.name;
    }
    addVessel(vessel){
        return this.vessels.set(vessel.id, vessel);
    }
    toString(){
        return `Service: ${this.name}`;
    }
}

module.exports = Service;