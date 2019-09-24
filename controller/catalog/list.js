module.exports = function(req, res){
    const con = require('../../connect');
    const Promise = require('bluebird')
    const lang = req.query.lang;
    let language = "vi"
    const queryAsync  = Promise.promisify(con.query.bind(con))

    if(lang){
      language  = lang
    }
  
    queryAsync(`SELECT * FROM mt_${language}_page_catalogs`).then(results => {
       return res.success(results)
    }).catch(err => {
       return res.serverError( err)
    })
}