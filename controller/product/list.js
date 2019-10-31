function panigation(page, numPages, numRows, numPerPage, response) {
  if (page <= numPages) {
    response.pagination = {
      totalNumberOfResults: numRows,
      current: page,
      perPage: numPerPage,
      pervious: page > 0 ? page - 1 : undefined,
      next: page < numPages ? page + 1 : undefined
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
    let limit = " LIMIT "+skip + "," + numPerPage;
    const id = req.body.id;
    const ids = req.body.ids;
    const no_limit = req.body.no_limit;
    const catid = req.body.catid;
    const list_cat = req.body.list_cat;
    const module_name = req.body.module_name;
    const order_by = req.body.order_by;
    const sort = req.body.sort;
    const lang = req.query.lang;
    const queryAsync = Promise.promisify(con.query.bind(con));
    let distinct = "";
    let where = "WHERE t1.show_web = 1";	
    let language = "vi";
    let module_name_default = "page";
    let order = "edit_time";
    let groupby = "GROUP BY same_group ";
    let order_type = "DESC";
    if (catid) {
      where += ` and t1.catid = ${catid}`;
    }
    if (list_cat) {
      where += ` and t1.catid IN (${list_cat})`;
    }	
	if (id) {
		where += ` and t1.id = '${id}'`;		
	}
	if(ids){
		where += ` and t1.id IN (${ids})`;
		groupby = "";
		distinct = "DISTINCT ";
	}
    if(lang){
        language = lang;
    }
    if(module_name){
        module_name_default = module_name;
    }
    if(order_by){
        order = order_by;
    }
    if(sort){
        order_type = sort;
    }
	if(no_limit){
		limit = "";
	}
    const count = await queryAsync(
      `SELECT count(DISTINCT(same_group)) as numRows FROM mt_${language}_${module_name_default}_products AS t1 ${where}`
    );
    numRows = count[0].numRows;
    numPages = Math.ceil(numRows / numPerPage);
	where += ` AND t1.id = t2.pro_id`;
    const data = await queryAsync(
      `SELECT ${distinct}t1.* FROM mt_${language}_${module_name_default}_products AS t1, mt_${language}_${module_name_default}_group_items AS t2 ${where} ${groupby}ORDER BY ${order} ${order_type}${limit}`
    );
	const module = await queryAsync(
      `SELECT * FROM mt_${language}_modules WHERE module_file = 'page' AND module_data != '${module_name_default}'`
    );
	const num_array = [];
	const data_sum_num = [];
	for(i=0; i<data.length; i++){
		let id = data[i].id;
		let num = 0;
		let same_num = 0;
		for(ii=0; ii<module.length; ii++){
			const module_num = await queryAsync(
			  `SELECT num FROM mt_${language}_${module[ii].module_data}_products WHERE id = ${data[i].id}`
			);
			const module_same_num = await queryAsync(
			  `SELECT sum(num) AS num FROM mt_${language}_${module[ii].module_data}_products WHERE same_group = ${data[i].same_group}`
			);
			num += module_num[0].num;
			same_num += module_same_num[0].num;
		}
		data[i].total_num = num;
		data[i].total_same_num = same_num;
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
