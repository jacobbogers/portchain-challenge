class Service {
    constructor(name){
        this.name = name;
        this.vessels = new Map();
    }
    addVessel(vessel){
        return this.vessels.set(vessel.id, vessel);
    }
}

module.exports = Service;