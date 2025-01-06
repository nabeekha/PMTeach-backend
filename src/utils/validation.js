const Joi = require("joi");

const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    loginType: Joi.string().required(),
  }).unknown();
  return schema.validate(data);
};

const validateCourse = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    access_level: Joi.string().valid("basic", "premium", "pro").required(),
  }).unknown();
  return schema.validate(data);
};

const validateVideo = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
  }).unknown();

  return schema.validate(data);
};

const validateProgress = (data) => {
  const schema = Joi.object({
    videoId: Joi.string().required(),
  }).unknown();

  return schema.validate(data);
};

module.exports = {
  validateUser,
  validateCourse,
  validateVideo,
  validateProgress,
};
