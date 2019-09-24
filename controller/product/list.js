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
    const limit = skip + "," + numPerPage;
    const catid = req.body.catid;
    const queryAsync = Promise.promisify(con.query.bind(con));
    let where = "WHERE 1";
    if (catid) {
      where += ` and catid = ${catid}`;
    }
    console.log(where);

    const count = await queryAsync(
      `SELECT count(*) as numRows FROM mt_vi_page_products ${where}`
    );
    numRows = count[0].numRows;
    numPages = Math.ceil(numRows / numPerPage);
    const data = await queryAsync(
      `SELECT * FROM mt_vi_page_products ${where} ORDER BY ID DESC LIMIT ${limit} `
    );

    let responsePayload = {
      results: data
    };
    await panigation(page, numPages, numRows, numPerPage, responsePayload);
    res.success(responsePayload);
  } catch (error) {
    console.log(error);

    res.serverError(error);
  }
};
