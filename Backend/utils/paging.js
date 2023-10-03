// tính page

const paginate = (data, page) => {
  const limit = 20;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  results.totalPages = Math.ceil(data.length / limit);

  results.data = data.slice(startIndex, endIndex);

  return results;
};

module.exports = paginate;
