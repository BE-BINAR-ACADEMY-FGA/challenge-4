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

function CheckPostAccountReq(req, res, next) {
  const schema = Joi.object({
    bank_name: Joi.string().required(),
    bank_account_number: Joi.string().required(),
    balance: Joi.number(),
    user_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    let respErr = templateResponse("error", error.details[0].message);
    return res.json(respErr);
  }

  next();
}

const CheckDepositWithdraw = (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number().required(),
  });

  if (req.body.amount <= 0) {
    let respErr = templateResponse("error", "Amount must be greater than 0");
    return res.json(respErr);
  }

  if (req.body.amount !== Number(req.body.amount)) {
    let respErr = templateResponse("error", "Amount must be a number");
    return res.json(respErr);
  }

  const { error } = schema.validate(req.body);
  if (error) {
    let respErr = templateResponse("error", error.details[0].message);
    return res.json(respErr);
  } else {
    next();
  }
};

module.exports = {
  CheckPostReq,
  CheckPostAccountReq,
  CheckDepositWithdraw,
};
