import express from "express";
import { errorResponse, successResponse } from "../helpers/responseUtil";

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

router.all("*", (req, res) => {
  errorResponse(res, 404, "404 Page not found");
});

export default router;
