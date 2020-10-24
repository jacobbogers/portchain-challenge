class Vessel {
    constructor(imo, name){
        this.id = imo;
        this.name = name;
        this.services = new Map();
    }
    addService(service){
        const old = this.services.get(service.name);
        if (!old){
            this.services.set(service.name, service);
            return true;
        }
        return false;
    }
    toString(){
        return `Vessel: ${this.id}_${this.name}`;
    }
}

module.exports = Vessel;