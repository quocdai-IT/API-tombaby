module.exports = async function(req, res){
	try{
		const _ = require("lodash");
		const con = require("../../connect");
		const Promise = require("bluebird");	
		const module_name = req.body.module_name;
		const same_group = req.body.same_group;
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
		let data = [];
		const data_sum_num = [];
		if(same_group){
			data = await queryAsync(
				`SELECT t1.* FROM mt_${language}_${module_name_default}_products AS t1 WHERE same_group = ${same_group} ORDER BY txt_properties ASC`
			);
			const module = await queryAsync(
			  `SELECT * FROM mt_${language}_modules WHERE module_file = 'page' AND module_data != '${module_name_default}'`
			);
			const num_array = [];
			for(i=0; i<data.length; i++){
				let num = 0;
				for(ii=0; ii<module.length; ii++){
					const module_num = await queryAsync(
					  `SELECT num FROM mt_${language}_${module[ii].module_data}_products WHERE id = ${data[i].id}`
					);
					num += module_num[0].num;
				}
				data[i].total_num = num;
				data_sum_num[i]= data[i];
			}
		}
		let responsePayload = {
		  results: data_sum_num
		};		
		res.success(responsePayload);
	} catch (error) {
		res.serverError(error);
	}
};