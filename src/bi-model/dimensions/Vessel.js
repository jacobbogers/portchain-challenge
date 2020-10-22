class Vessel {
    constructor(imo, name){
        this.id = imo;
        this.name = name;
        this.services = new Map();
    }
    equals(aVessel){
        return this.id === aVessel.id;
    }
    addService(service){
        const old = this.services.get(service.name);
        if (!old){
            this.services.set(service.name, service);
            return true;
        }
        /*if (this.services.size > 0){
            throw new Error(`${String(Vessel)} assigned to different service: ${String(service)}?`)
        }*/
        return false;
    }
    toString(){
        return `Vessel: ${this.id}_${this.name}`;
    }
}

module.exports = Vessel;