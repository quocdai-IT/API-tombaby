module.exports = function(req, res){
	try{
		const _ = require("lodash");
		const con = require("../../connect");
		const Promise = require("bluebird");	
		const module_name = req.body.module_name;
		const lang = req.query.lang;
		const queryAsync = Promise.promisify(con.query.bind(con));	
		let language = "vi";

		if(lang){
		  language  = lang
		}
		
		let module_name_default = "page";
		if(module_name){
			module_name_default = module_name;
		}
		const module = await queryAsync(
		  `SELECT * FROM mt_${language}_modules WHERE module_file = 'page' AND module_data != '${module_name_default}'`
		);
		let responsePayload = {
		  results: module_name_default
		};		
		res.success(responsePayload);
	} catch (error) {
		console.log(error);
		res.serverError(error);
	}
};