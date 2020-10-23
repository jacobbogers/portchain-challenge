
//model
const Star = require('./bi-model/star');
const Port = require('./bi-model/dimensions/Port');
const Vessel = require('./bi-model/dimensions/Vessel');
const Service = require('./bi-model/dimensions/Service');
const PortCall = require('./bi-model/facts/PortCall');
const LogEntry = require('./bi-model/facts/LogEntry');


module.exports = function buildStarSchema(vessels, schedules, logger) {
    const star = new Star();
    // process vessels
    for (const v of vessels) {
        const vessel = new Vessel(v.imo, v.name);
        star.addVessel(vessel);
    }
    for (const { id, data: portCalls } of schedules) {
        if (!portCalls) {
            continue;
        }
        for (const pci of portCalls) {
            let port = star.getPortById(pci.port.id);
            if (!port){
               port = new Port(pci.port.id, pci.port.name);
               star.addPort(port);
            }
            const service = new Service(pci.service);
            const vessel = star.getVesselById(id);
            if (!vessel) {
                logger.debug(`Vessel ${id} not previously fetched`);
                continue;
            }
            service.addVessel(vessel);
            vessel.addService(service);
            const arrival = new Date(pci.arrival); // ISO 8601, should have been prev sanitized & validated
            const departure = new Date(pci.departure);
            const isOmitted = !!pci.isOmitted;
            const createdDate = new Date(pci.createdDate);
            const portCall = new PortCall(port, vessel, createdDate, departure, arrival, isOmitted, []);
            // fetch logEntries , do we need it?
            for (const li of pci.logEntries) {
                const lo_arrival = li.arrival ? new Date(li.arrival) : null;
                const lo_departure = li.departure ? new Date(li.departure) : null;
                const lo_isOmitted = typeof li.isOmitted === 'boolean' ? li.isOmitted : null;
                const lo_updatedField = li.updatedField;
                const lo_createdDate = new Date(li.createdDate);
                const logEntry = new LogEntry(portCall, lo_arrival, lo_departure, lo_isOmitted, lo_createdDate, lo_updatedField);
                portCall.addLogEntry(logEntry);
            }
            // sort logEntries on createDate (just to be sure)
            portCall.logEntries.sort((l1,l2)=>{
                return l1.compareTo(l2);
            })
            star.addPortCall(portCall);
        }
    }
    return star;
};
