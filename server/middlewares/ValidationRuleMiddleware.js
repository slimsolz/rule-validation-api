import Joi from "joi";
import { errorResponse } from "../helpers/responseUtil";

export const validationRuleMiddleware = (req, res, next) => {
  const schema = Joi.object().keys({
    rule: Joi.object({
      field: Joi.string().required(),
      condition: Joi.string()
        .valid("eq", "neq", "gt", "gte", "contains")
        .required(),
      condition_value: Joi.required(),
    }).required(),

    data: Joi.alternatives()
      .try(Joi.object(), Joi.array(), Joi.string())
      .required(),
  });

  const { rule, data } = req.body;

  const { error } = Joi.validate(
    {
      rule,
      data,
    },
    schema
  );

  if (error) {
    const { details } = error;
    return errorResponse(res, 400, `${details[0].message}.`);
  }
  return next();
};

export const validateFieldExistsInData = (req, res, next) => {
  const { rule, data } = req.body;

  if (typeof data === "object") {
    if (rule.field.includes(".")) {
      let [first, second] = rule.field.split(".");
      if (!data[first].hasOwnProperty(second)) {
        return errorResponse(
          res,
          400,
          `field ${second} is missing from data.${first}.`
        );
      }
    } else if (!data.hasOwnProperty(rule.field)) {
      return errorResponse(
        res,
        400,
        `field ${rule.field} is missing from data.`
      );
    }
  }

  return next();
};
