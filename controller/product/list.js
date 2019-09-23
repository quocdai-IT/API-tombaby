function panigation (page,numPages,numRows, numPerPage,response){
    if(page < numPages){
        response.pagination = {
            totalNumberOfResults: numRows,
            current: page,
            perPage: numPerPage,
            pervious: page > 0? page -1: undefined,
            next: page < numPages -1 ?page+1:undefined
        }
    }
    else{
        response.pagination = {
         err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
        }
    }
}

module.exports =async function(req, res){
 try {
    const _ = require('lodash')
    const con = require('../../connect');
    const Promise = require('bluebird')
    let numRows;
    let queryPagination;
    const numPerPage = parseInt(req.query.numPerPage) || 100;
    const page = parseInt(req.query.page) || 1;
    let numPages;
    const skip = page > 0? ((page-1) * numPerPage):0;
    const limit = skip + ',' + numPerPage;
    const catid = req.query.catid;
    const queryAsync  = Promise.promisify(con.query.bind(con))
    if(catid){
        const count = await queryAsync(`SELECT count(*) as numRows FROM mt_vi_page_products Where catid = ${catid}`)
        numRows = count[0].numRows;
        numPages = Math.ceil(numRows/numPerPage);
        const data = await  queryAsync(`SELECT * FROM mt_vi_page_products Where catid = ${catid} ORDER BY ID DESC LIMIT ${limit} `)
        let responsePayloadWhere = {results: data}
        await panigation(page,numPages,numRows,numPerPage,responsePayloadWhere)
        res.success(responsePayloadWhere)
    }
    else{
        const count = await queryAsync("SELECT count(*) as numRows FROM mt_vi_page_products")
        numRows = count[0].numRows;
        numPages = Math.ceil(numRows/numPerPage);
        const data = await  queryAsync(`SELECT * FROM mt_vi_page_products ORDER BY ID DESC LIMIT ${limit} `)

        let responsePayload = {
            results: data
        };
        await panigation(page,numPages,numRows,numPerPage,responsePayload)
        res.success(responsePayload)
    }
 } catch (error) {
     res.serverError(error)
 }

  
}