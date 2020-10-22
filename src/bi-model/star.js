/**
 * BI-Star Schema, well actually its snowflake since vessels have 
 */
class Star {
    constructor() {
        // dimensions
        this.ports = new Map();
        this.vessels = new Map();
        // fact
        this.portCalls = new Map();
    }
    addPort(port) {
        if (this.ports.has(port.id)) {
            return;
        }
        this.ports.set(port.id, port);
    }
    addVessel(vessel) {
        const v = this.vessels.get(vessel.id);
        if (!v) {
            this.vessels.set(vessel.id, vessel);
            return true;
        }
        if (!v.equals(vessel)) {// vessel name change???
            throw new Error(`Vessel has changed name? old:${String(v)} to new:${String(vessel)}`);
        }
        return false;
    }
    addPortCall(portCall) {
        const v = this.portCalls.get(portCall.hash());
        if (v) {
            throw new Error(`PortCall was previously added old:[${String(v)}]; new:[${String(portCall)}]`);
        }
        this.portCalls.set(portCall.hash(), portCall);
    }
    getVesselById(id) {
        return this.vessels.get(id);
    }
    getPortById(id) {
        return this.ports.get(id);
    }
    getAllPortCalls() {
        return this.portCalls.values();

    }

    // Some queries
}

module.exports = Star;