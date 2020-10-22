module.exports = async function safe(promise){
    try {
       const data = await promise;
       return data
    }
    catch(err){
        return undefined;
    }
}