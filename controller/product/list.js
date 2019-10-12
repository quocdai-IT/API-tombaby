function panigation(page, numPages, numRows, numPerPage, response) {
  if (page <= numPages) {
    response.pagination = {
      totalNumberOfResults: numRows,
      current: page,
      perPage: numPerPage,
      pervious: page > 0 ? page - 1 : undefined,
      next: page < numPages - 1 ? page + 1 : undefined
    };
  } else {
    response.pagination = {
      err: "queried page " + page + " is >= to maximum page number " + numPages
    };
  }
}

module.exports = async function(req, res) {
  try {
    
    const _ = require("lodash");
    const con = require("../../connect");
    const Promise = require("bluebird");
    let numRows;
    let queryPagination;
    const numPerPage = parseInt(req.body.numPerPage) || 100;
    const page = parseInt(req.body.page) || 1;
    let numPages;
    const skip = page > 0 ? (page - 1) * numPerPage : 0;
    const limit = " LIMIT "+skip + "," + numPerPage;
    const id = req.body.id;
    const catid = req.body.catid;
    const list_cat = req.body.list_cat;
    const module_name = req.body.module_name;
    const lang = req.query.lang;
    const queryAsync = Promise.promisify(con.query.bind(con));
    let where = "WHERE t1.show_web = 1";	
    let language = "vi";
    let module_name_default = "page";
    if (catid) {
      where += ` and t1.catid = ${catid}`;
    }
    if (list_cat) {
      where += ` and t1.catid IN (${list_cat})`;
    }	
	if (id) {
		where += ` and t1.id = '${id}'`;		
	}
    if(lang){
        language = lang;
    }
    if(module_name){
        module_name_default = module_name;
    }
    const count = await queryAsync(
      `SELECT count(DISTINCT(same_group)) as numRows FROM mt_${language}_${module_name_default}_products AS t1 ${where}`
    );
    numRows = count[0].numRows;
    numPages = Math.ceil(numRows / numPerPage);
	where += ` AND t1.id = t2.pro_id`;
    const data = await queryAsync(
      `SELECT t1.* FROM mt_${language}_${module_name_default}_products AS t1, mt_${language}_${module_name_default}_group_items AS t2 ${where} GROUP BY same_group ORDER BY ID DESC${limit}`
    );
	const module = await queryAsync(
      `SELECT * FROM mt_${language}_modules WHERE module_file = 'page' AND module_data != '${module_name_default}'`
    );
	const num_array = [];
	const data_sum_num = [];
	for(i=0; i<data.length; i++){
		let num = 0;
		for(ii=0; ii<module.length; ii++){
			const module_num = await queryAsync(
			  `SELECT num FROM mt_${language}_${module[ii].module_data}_products WHERE id = ${data[i].id}`
			);
			data[i].num += module_num[0].num;
		}
		data_sum_num[i]= data[i];
	}
	
    let responsePayload = {
      results: data_sum_num
    };
    await panigation(page, numPages, numRows, numPerPage, responsePayload);
    res.success(responsePayload);
  } catch (error) {
    console.log(error);
    res.serverError(error);
  }
};
