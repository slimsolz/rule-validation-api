import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";

require("express-async-errors");

const app = express();

const port = process.env.PORT || 8000;
app.set("port", port);

app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((err, req, res, next) => {
  return res.status(400).json({
    success: false,
    message: err.errors[0].message,
  });
});

app.get("/", (req, res) => {
  res.json("welcome");
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

export default app;
