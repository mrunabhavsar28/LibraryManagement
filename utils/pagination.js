const paginateResults = (page, pageSize, data) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
  
    const results = {};
  
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        pageSize,
      };
    }
  
    if (endIndex < data.length) {
      results.next = {
        page: page + 1,
        pageSize,
      };
    }
  
    results.results = data.slice(startIndex, endIndex);
  
    return results;
  };
  
  module.exports = { paginateResults };
  