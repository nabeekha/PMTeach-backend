const paginate = async (
  model,
  query = {},
  page,
  limit,
  populateOptions = {}
) => {
  if (!page || !limit) {
    const queryResult = model.find(query);
    if (populateOptions.path) {
      queryResult.populate(populateOptions);
    }
    return await queryResult.exec();
  }

  const skip = (page - 1) * limit;
  const total = await model.countDocuments(query);

  let queryResult = model.find(query).skip(skip).limit(limit);

  if (populateOptions.path) {
    queryResult = queryResult.populate(populateOptions);
  }

  const results = await queryResult.exec();

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    data: results,
  };
};

module.exports = paginate;
