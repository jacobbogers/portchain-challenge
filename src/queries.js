function top5AndLeast5PortsArrival(star){
    // tally up the arrivals p
    let report = new Map();

    // reduce
    for (const portCall of star.getAllPortCalls()){
        if (portCall.isOmitted){
            continue;
        }
        const port = portCall.getPort();
        const count = report.get(port) || 0;
        report.set(port, count + 1);
    }
    // sort descending order
    report = Array.from(report.entries()).sort((a,b) => {
        return b[1]-a[1];
    });

    function toObj(v){
        return ({id: v[0].id, name: v[0].name, count: v[1]})
    }
    const top5 = report.slice(0,5).map(toObj);
    const least5 = report.slice(-5).map(toObj).reverse();
    return [ top5, least5];
}

function percentileDurationCandleStick(star){
    let portHistograms = new Map();
    // reduce
    for (const portCall of star.getAllPortCalls()){
        if (portCall.isOmitted){
            continue;
        }
        const port = portCall.getPort();
        const histogram = portHistograms.get(port) || [];
        portHistograms.set(port, histogram);
        histogram.push(portCall.getDuration());
    }
    // find the percMarkers
    for (const [port, histogram] of portHistograms.entries()){
        console.log(port, histogram.sort()); 
    }

}

module.exports = {
    top5AndLeast5PortsArrival,
    percentileDurationCandleStick
}