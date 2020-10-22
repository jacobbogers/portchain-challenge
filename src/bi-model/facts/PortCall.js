const hash256 = require('../../utils/hash256');

class PortCall {
    /**
     * Represents a PortCall
     * @constructor
     * @param {Port} port a port
     * @param {Vessel} vessel  a vessel 
     * @param {Date} createDate date of first created log entry (schedule)
     * @param {Date} arrival
     * @param {Date} departure
     * @param {boolean} isOmitted if the portCall is skipped (depend on most current logEntry)
     * @param {LogEntry[]} logEntries 
     */
    constructor(port, vessel, createDate, departure, arrival, isOmitted, logEntries){
        this.port = port;
        this.vessel = vessel;
        this.createDate = createDate;
        this.isOmitted = isOmitted;
        this.departure = departure;
        this.arrival = arrival; 
        this.logEntries = logEntries || [];

        // pre-compute for speed
        
        this.duration = departure.getTime()-arrival.getTime(); 
        this._toString = `PortCall: [${String(this.vessel)}][${String(this.port)}][${this.arrival.getTime()}][${this.departure.getTime()}]`;
        this._hash = hash256(this._toString).toString('hex');
    }

    addLogEntry(le){
        this.logEntries.push(le);
    }

    getPort(){
        return this.port;
    }

    getVessel(){

    }

    getDuration(){
        return this.duration;
    }

    toString(){
        return this._toString;
    }
    hash(){ // a hash 256 of the toString() (less storage, 256 bits is only 32 octets)
        return this._hash;
    }
}

module.exports = PortCall;