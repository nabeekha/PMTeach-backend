const paginate = async (model, query, page, limit) => {
  if (!page || !limit) {
    return await model.find(query);
  }

  const skip = (page - 1) * limit;
  const total = await model.countDocuments(query);
  const results = await model.find(query).skip(skip).limit(limit);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    data: results,
  };
};

module.exports = paginate;
