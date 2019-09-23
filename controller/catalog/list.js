module.exports = function(req, res){
    const con = require('../../connect');
    const Promise = require('bluebird')

    const queryAsync  = Promise.promisify(con.query.bind(con))

    queryAsync("SELECT * FROM mt_vi_page_catalogs").then(results => {
       return res.success(results)
    }).catch(err => {
       return res.json({error: err})
    })
}