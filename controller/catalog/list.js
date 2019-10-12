module.exports = function(req, res){
    const con = require('../../connect');
    const Promise = require('bluebird')
    const lang = req.query.lang;
    const module_name = req.query.module_name;
    let language = "vi"
    const queryAsync  = Promise.promisify(con.query.bind(con))

    if(lang){
      language  = lang
    }
	
    let module_name_default = "page";
	if(module_name){
        module_name_default = module_name;
    }
    queryAsync(`SELECT * FROM mt_${language}_${module_name_default}_catalogs`).then(results => {
       return res.success(results)
    }).catch(err => {
       return res.serverError( err)
    })
}