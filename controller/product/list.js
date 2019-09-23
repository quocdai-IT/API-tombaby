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

    let results =[];
    const queryAsync  = Promise.promisify(con.query.bind(con))

    const count = await queryAsync("SELECT count(*) as numRows FROM mt_vi_page_products")
    numRows = count[0].numRows;
    numPages = Math.ceil(numRows/numPerPage);

    const catalog = await  queryAsync("SELECT * FROM mt_vi_page_catalogs");
    const data = await  queryAsync(`SELECT * FROM mt_vi_page_products ORDER BY ID DESC LIMIT ${limit} `)

    data.forEach(product => {
        catalog.forEach(cat => {
            if(product.catid === cat.catid){
                delete product.catid;
                results.push({...product, catalog: cat})
            }
        })
    })
    let responsePayload = {
        results: results
    };
    if(page < numPages){
        responsePayload.pagination = {
            totalNumberOfResults: numRows,
            current: page,
            perPage: numPerPage,
            pervious: page > 0? page -1: undefined,
            next: page < numPages -1 ?page+1:undefined
        }
    }
    else{
        responsePayload.pagination = {
         err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
        }
    }

    res.success(responsePayload)
 } catch (error) {
     res.serverError(error)
 }

  
}