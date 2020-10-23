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

async function init(){
   logger.info('start');
   const vessels = await downloadVessels(config.urlVessels, logger, createHttpsRequest);
   logger.info(`vessel data downloaded, count ${vessels.length}`);
   const portCalls = await downloadSchedules(config.urlPortCalls, config.parallelism, vessels, logger, createHttpsRequest);
   logger.info(`vesselSchema data downloaded, count ${portCalls.length}`);
   const star = buildStarSchema(vessels, portCalls.filter(pc => !pc.error), logger);
   logger.info('Star schema build');
   // reports
   /*const [top5, lowest5] = top5AndLeast5PortsArrival(star);
   console.log(top5);
   console.log(lowest5);
   const durationRank = nearestRankMethodForDuration(star,5,20,50,75,90);
   console.log(durationRank);*/
   const dayDelays = nearestRankMethodForVesselDelay(star, 5,50,80);
   console.log(dayDelays(2,14,7));
}


init()
.catch(err => {
    logger.error(`App exit due to error:${String(err)}`);
})
.then(()=>{
    logger.info('done');
})
