'use strict';
//3rd party
const colors = require('colors/safe');
const { Table } = require('console-table-printer');

// general
const createLogger = require('./utils/createLogger');

// abstraction, can be replaced by a mock (unit test)
const createHttpsRequest = require('./utils/client/createHttpsRequest');

// data transfer
const { downloadVessels, downloadSchedules } = require('./downloads');
const buildStarSchema = require('./buildStarSchema');

//queries
const {
    top5AndLeast5PortsArrival,
    nearestRankMethodForDuration,
    nearestRankMethodForVesselDelay } = require('./queries');
//config
const config = require('./config.json');

// initialize logger
function format(text) {
    return `[${new Date().toUTCString()}]: ${text}`
}

const logger = createLogger({
    log: text => console.log(colors.green(format(text))),
    error: text => console.log(colors.red(format(text))),
    warn: text => console.log(colors.yellow(format(text))),
    info: text => console.log(colors.cyan(format(text))),
})

function printReport(title, columns, data){
    columns = Array.isArray(columns) ? columns : [columns];
    const report = new Table({ columns, title });
    report.addRows(data);
    report.printTable();
}

async function init() {
    logger.info('start');
    const vessels = await downloadVessels(config.urlVessels, logger, createHttpsRequest);
    logger.info(`vessel data downloaded, count ${vessels.length}`);
    const portCalls = await downloadSchedules(config.urlPortCalls, config.parallelism, vessels, logger, createHttpsRequest);
    logger.info(`vesselSchema data downloaded, count ${portCalls.length}`);
    const star = buildStarSchema(vessels, portCalls.filter(pc => !pc.error), logger);
    logger.info('star schema build');
    // reports
    const [top5, lowest5] = top5AndLeast5PortsArrival(star);
    //console.log(top5);
    //console.log(lowest5);
    const durationRank = nearestRankMethodForDuration(star, 5, 20, 50, 75, 90);
    //console.log(durationRank);
    const dayDelays = nearestRankMethodForVesselDelay(star, 5, 50, 80);
    const dayDelayRanks = dayDelays(2,14,7);
    logger.info('reports generated');
    printReport('The top 5 ports with the most arrivals', {name: 'port', alignment: 'left'}, top5 );
    printReport('The top 5 ports with the fewest arrivals', {name: 'port', alignment: 'left'}, lowest5 );
    printReport('Port call durations percentiles',  { name: 'port', alignment: 'left'}, durationRank);
    printReport('Vessel port call daly percentiles',{ name: 'port', alignment: 'left'}, dayDelayRanks);
}


init()
    .catch(err => {
        logger.error(`App exit due to error:${String(err)}`);
    })
