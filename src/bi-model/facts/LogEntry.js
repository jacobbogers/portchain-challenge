class LogEntry {
    constructor(portCall, arrival, departure, isOmitted, createDate, updatedField){
        this.portCall = portCall;
        this.arrival = arrival;
        this.departure = departure;
        this.isOmitted = isOmitted;
        this.createDate = createDate;
        this.updatedField = updatedField;
    }

}

module.exports = LogEntry;