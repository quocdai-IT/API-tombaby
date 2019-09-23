function success(data) {
    return this.status(200).json({
      success: true,
      message: 'Request successfully',
      data: data
    });
  }
  
  function notFound(msg = 'Not Found!') {
    return this.status(404).json({
      success: false,
      message: 'Request failed',
      data: msg
    });
  }
  
  function pagination(currentPage, totalResult, result, itemsPerPage) {
    return this.status(200).json({
      success: true,
      message: 'Request successfully',
      data: {
        results: result,
        pagination: {
          totalNumberOfResults: totalResult,
          itemsPerPage: itemsPerPage,
          currentPageIndex: currentPage
        }
      }
    });
  }
  
  function invalidInput(err, msg = 'Request failed') {
    return this.status(422).json({
      success: false,
      message: msg,
      // eslint-disable-next-line camelcase
      error_code: 422, // why not errorCode?
      data: err
    });
  }
  function serverError(err = 'Unknown Server error') {
    console.log({ err });
  
    return this.status(500).json({
      success: false,
      message: 'Server Error',
      data: err
    });
  }
  module.exports = function(req, res, next) {
    //Form invalidate
    res.invalidInput = invalidInput;
  
    // From post success
    res.success = success;
  
    // Not Found
    res.notFound = notFound;
  
    // list
    res.pagination = pagination;
  
    //server error
    res.serverError = serverError;
    next();
  };
  
  module.exports.success = success;
  module.exports.notFound = notFound;
  module.exports.pagination = pagination;
  module.exports.serverError = serverError;
  module.exports.invalidInput = invalidInput;
  