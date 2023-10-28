const { templateResponse } = require("../helpers/template-response");
const Joi = require("joi");

function CheckPostReq(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    identity_type: Joi.string(),
    identity_number: Joi.string(),
    address: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    let respErr = templateResponse("error", error.details[0].message);
    return res.json(respErr);
  }

  next();
}

module.exports = {
  CheckPostReq,
};
