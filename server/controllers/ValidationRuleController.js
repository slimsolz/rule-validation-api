import { errorResponse, successResponse } from "../helpers/responseUtil";
import "babel-polyfill";

class ValidationRuleController {
  static async validateRule(req, res, next) {
    try {
      const { rule, data } = req.body;
      let result = false;
      let firstCondition = data[rule.field];

      if (rule.field.includes(".")) {
        let [first, second] = rule.field.split(".");
        firstCondition = data[first][second];
      }

      switch (rule.condition) {
        case "eq":
          result = firstCondition === rule.condition_value;
          break;
        case "neq":
          result = firstCondition !== rule.condition_value;
          break;
        case "gt":
          result = firstCondition > rule.condition_value;
          break;
        case "gte":
          result = firstCondition >= rule.condition_value;
          break;
        case "contains":
          result = firstCondition.includes(rule.condition_value);
          break;
      }

      if (result) {
        return successResponse(
          res,
          200,
          `field ${rule.field} successfully validated.`,
          {
            validation: {
              error: false,
              field: rule.field,
              field_value: firstCondition,
              condition: rule.condition,
              condition_value: rule.condition_value,
            },
          }
        );
      } else {
        errorResponse(res, 400, `field ${rule.field} failed validation.`, {
          validation: {
            error: true,
            field: rule.field,
            field_value: firstCondition,
            condition: rule.condition,
            condition_value: rule.condition_value,
          },
        });
      }
    } catch (err) {
      /* istanbul ignore next */
      next(err);
    }
  }
}

export default ValidationRuleController;
