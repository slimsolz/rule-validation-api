import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import index from "./routes";

require("express-async-errors");

const app = express();

const port = process.env.PORT || 8000;
app.set("port", port);

app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", index);

app.use((err, req, res, next) => {
  /* istanbul ignore next */
  return res.status(400).json({
    success: false,
    message: err.errors[0].message,
  });
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

export default app;
