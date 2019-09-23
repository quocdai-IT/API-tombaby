module.exports = function(req, res){
 
    const con = require('../../connect');
    const Promise = require('bluebird')
    let numRows;
    let queryPagination;
    const numPerPage = parseInt(req.query.numPerPage) || 100;
    const page = parseInt(req.query.page) || 1;
    let numPages;
    const skip = page > 0? ((page-1) * numPerPage):0;
    const limit = skip + ',' + numPerPage;

    const queryAsync  = Promise.promisify(con.query.bind(con))

   queryAsync("SELECT count(*) as numRows FROM mt_vi_page_products").then(results => {
      numRows = results[0].numRows;
      numPages = Math.ceil(numRows/numPerPage);
      
   })
   .then(() => queryAsync(`SELECT * FROM mt_vi_page_products ORDER BY ID DESC LIMIT ${limit} `)).then((data) => {
       let responsePayload = {
           results: data
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
   }).catch(err => {
        res.json({error: err})
   })
  
    
  
}