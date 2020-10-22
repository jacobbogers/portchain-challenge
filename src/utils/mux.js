module.exports = async function mux(promise){
    try {
       const data = await promise;
       return [data, undefined];
    }
    catch(err){
        return [undefined, err];
    }
}