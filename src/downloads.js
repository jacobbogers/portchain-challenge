//node
const url = require('url');

// app imports
const createHttpClient = require('./utils/client/createHttpClient');
const JSONParseSafe = require('./utils/JSONParseSafe');

async function downloadVessels(uri, logger, createHttpsRequest){
    // shred the url
    const { path, host } = url.parse(uri)
    const request = createHttpClient(createHttpsRequest, logger, { host });
    const [responseRaw, err] = await request('get', path, {}, '');
    if (err){
        throw Error(`Could not download vessel information, because ${String(err)}`);
    }
    if (!responseRaw){
        throw Error(`Empty vessel data returned from ${uri}`);
    }
    const json = JSONParseSafe(responseRaw);

    //TODO: validate properly with JSONSchema
    if (!json || typeof json !== 'object'){
        throw Error(`Empty vessel is not a valid Json Object: [${responseRaw}]`);
    }
    return json;
}

async function downloadSchedules(uri, parallelism, vessels, logger, createHttpsRequest){
    const vesselIds = vessels.map(({imo}) => imo);
    const operationalRequest = [];
    const data = [];
    const { path: prefixPath, host } = url.parse(uri)
    const request = createHttpClient(createHttpsRequest, logger, { host });

    while(vesselIds.length > 0 || operationalRequest.length > 0){
        // wait for request to complete
        while (operationalRequest.length < parallelism && vesselIds.length > 0){ // create request
            const id = vesselIds.pop();
            const path = (prefixPath[prefixPath.length-1] === '/') ? `${prefixPath}${id}`: `${prefixPath}/${id}`
            operationalRequest.push({ id, req:request('get',path, {}, '')});
        }
        if (vesselIds.length > 0){
            const { id, req} = operationalRequest[0];
            const [responseRaw, error] = await req;
            if (error){
                data.push({ id, error });
                logger.error(`Error downloading schedule for vessel ${id}, error:${String(error)}`);
            }
            else {
                const v = JSONParseSafe(responseRaw);
                data.push({ id: v.vessel.imo, data: v.portCalls });
            }
            operationalRequest.shift();
        }
        else { // speedup
            const results =  await Promise.allSettled(operationalRequest.map(or => or.req));
            for (let i = 0; i < results.length; i++){
                const { status, value: [v, err], reason } = results[i];
                const id = operationalRequest[i].id;
                if (status !== 'fulfilled'){
                    data.push({ id, error: reason });
                    logger.error(`Error downloading schedule for vessel ${id}, error:${String(reason)}`);
                }
                else if (err){
                    data.push({ id, error: err })
                    logger.error(`Error downloading schedule for vessel ${id}, error:${String(err)}`);
                }
                else {
                    const json =  JSONParseSafe(v); // proper JSONSchema validation
                    data.push({ id, data: json.portCalls })
                }
            }
            break;
        }
    }
    return data;
}

module.exports = {
    downloadVessels,
    downloadSchedules
}