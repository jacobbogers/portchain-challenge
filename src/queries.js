
const humanizeDuration = require('humanize-duration');

function top5AndLeast5PortsArrival(star) {
    // tally up the arrivals p
    let report = new Map();

    // reduce
    for (const portCall of star.getAllPortCalls()) {
        if (portCall.isOmitted) {
            continue;
        }
        const port = portCall.getPort();
        const count = report.get(port) || 0;
        report.set(port, count + 1);
    }
    // sort descending order
    report = Array.from(report.entries()).sort((a, b) => {
        return b[1] - a[1];
    });

    function toObj([port, count]) {
        return ({ port: `${port.id}-(${port.name})`, portCalls: count });
    }
    const top5 = report.slice(0, 5).map(toObj);
    const least5 = report.slice(-5).map(toObj).reverse();
    return [top5, least5];
}

function nearestRankMethodForDuration(star, ...percentiles) {
    if (!percentiles.length) {
        return []; // empty report
    }
    let portHistograms = new Map();
    // reduce
    for (const portCall of star.getAllPortCalls()) {
        if (portCall.isOmitted) {
            continue;
        }
        const port = portCall.getPort();
        const histogram = portHistograms.get(port) || { raw: [] };
        portHistograms.set(port, histogram);
        histogram.raw.push(portCall.getDuration());
    }
    // find the percMarkers, and generate report
    const report = [];
    for (const [port, histogram] of portHistograms.entries()) {
        histogram.raw.sort((a, b) => a - b);
        // calculate "nearestRank"
        const rank = {};
        for (const perc of percentiles) {
            // nearest rank method
            const n = Math.trunc(perc / 100 * (histogram.raw.length));
            rank[`${perc}%`] = humanizeDuration(histogram.raw[n]);
        }
        report.push({ port: `${port.id}-(${port.name})`, ...rank, nrSamples: histogram.raw.length });
    }
    // report
    return report.sort((r1, r2) => r2.nrSamples - r1.nrSamples);
}


/**
 * 
 * @param {logEntries[]} le 
 * @param  {...number} days days from arrival
 */
function getActualAndForeCasts(le, days) {

    const onlyA = le.filter(f => f.updatedField === 'arrival');
    let actual = onlyA.pop();
    let idays = 0;
    let scan = onlyA.length - 1;
    const foreCasts = {};
    while (scan >= 0 && idays < days.length) {
        const e = onlyA[scan];
        const eDay = Math.trunc((actual.arrival - e.createDate) / 86400000); //days
        while (eDay >= days[idays] && idays < days.length) {
            const foreCast = Math.abs(e.arrival - actual.arrival); //ms
            foreCasts[days[idays]] = foreCast;
            idays++;
        }
        scan--;
    }
    return foreCasts;
}

function nearestRankMethodForVesselDelay(star, ...percentiles) {
    if (!percentiles.length) {
        throw new Error('Illegal Argument: must specify percentiles');
    }
    return function (...days) {
        if (!days.length) {
            throw new Error('Illegal Argument: must specify days delays');
        }
        const delayDays = days.slice().sort((a, b) => a - b);
        //let report = new Map();
        const collect = new Map();
        for (const portCall of star.getAllPortCalls()) {
            if (portCall.isOmitted) {
                continue;
            }
            const foreCasts = getActualAndForeCasts(portCall.logEntries, delayDays);
            const vessel = `${portCall.vessel.id} ${portCall.vessel.name}`;
            let stats = collect.get(vessel);
            if (!stats) {
                stats = days.reduce((c, d) => { c[d] = { raw: [] }; return c; }, {});
                collect.set(vessel, stats);
            }
            // merge 
            for (const [day, v] of Object.entries(stats)) {
                v.raw.push(foreCasts[day]);
            }
        }
        const finalReport = [];
        for (const [vessel, stats] of collect.entries()) {
            for (const [day, histogram]  of Object.entries(stats)){
                histogram.raw.sort((a,b)=>a-b); // sort
                const rank = {}
                for (const perc of percentiles) {
                    // nearest rank method
                    const n = Math.trunc(perc / 100 * (histogram.raw.length));
                    rank[`${perc}%`] = humanizeDuration(histogram.raw[n]);
                }
                histogram.percentiles = rank;
                finalReport.push({ vessel, ['days from arrival']:day,  ...rank, nrSamples: histogram.raw.length });
            }
        }
        // post process
        return finalReport;
    }
}

module.exports = {
    top5AndLeast5PortsArrival,
    nearestRankMethodForDuration,
    nearestRankMethodForVesselDelay
};