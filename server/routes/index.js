import express from "express";
import ValidationRuleController from "../controllers/ValidationRuleController";
import { errorResponse, successResponse } from "../helpers/responseUtil";
import {
  validationRuleMiddleware,
  validateFieldExistsInData,
} from "../middlewares/ValidationRuleMiddleware";

const router = express.Router();

router.get("/", (req, res) => {
  const data = {
    name: "Odumah Solomon",
    github: "@slimsolz",
    email: "odumahs@gmail.com",
    mobile: "08138826540",
    twitter: "@slimsolz",
  };

  successResponse(res, 200, "My Rule-Validation API", data);
});

router.post(
  "/validate-rule",
  validationRuleMiddleware,
  validateFieldExistsInData,
  ValidationRuleController.validateRule
);

router.all("*", (req, res) => {
  errorResponse(res, 404, "404 Page not found.");
});

export default router;
