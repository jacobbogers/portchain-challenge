'use strict';
//3rd party
const colors = require('colors/safe');

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
    percentileDurationCandleStick } = require('./queries');
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

async function init(){
   logger.info('start');
   const vessels = await downloadVessels(config.urlVessels, logger, createHttpsRequest);
   logger.info(`vessel data downloaded, nr ${vessels.length}`);
   const portCalls = await downloadSchedules(config.urlPortCalls, config.parallelism, vessels, logger, createHttpsRequest);
   logger.info(`vesselSchema data downloaded, nr ${portCalls.length}`);
   const star = buildStarSchema(vessels, portCalls.filter(pc => !pc.error), logger);
   const leastMost = top5AndLeast5PortsArrival(star);
   console.log(leastMost);
   const candleStick = percentileDurationCandleStick(star);
   console.log(candleStick);
   /*const schedules = await downloadSchedules(config.urlPortCalls, config.parallelism, logger, createHttpsRequest);
   const star = buildStarSchema(vessels, schedules);
   for (const query of queries){
        const report = query(star);
        printReport(report);
   }*/
}

init()
.catch(err => {
    logger.error(`App exit due to error:${String(err)}`);
})
.then(()=>{
    logger.info('done');
})
