import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";
import "babel-polyfill";

const { expect } = chai;
chai.use(chaiHttp);

const rule = {
  field: "missions",
  condition: "gte",
  condition_value: 30,
};

const ruleWithMissingField = {
  condition: "gte",
  condition_value: 30,
};

const ruleWithInvalidCondition = {
  field: "missions",
  condition: "invalid",
  condition_value: 30,
};

describe("POST /validate-rule", () => {
  it("should return 400 and an error message for missing rule fields", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({ data: { name: "test" } });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
    expect(res.body.message).to.be.equal('"rule" is required.');
  });

  it("should return 400 and an error message if rule field is not a valid JSON", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({ rule: ["one"], data: { name: "test" } });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
    expect(res.body.message).to.be.equal('"rule" must be an object.');
  });

  it("should return 400 and an error message for missing data fields", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({ rule });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
    expect(res.body.message).to.be.equal('"data" is required.');
  });

  it("should return 400 and an error message data field is not a valid JSON, array or string", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({ rule, data: 23 });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
    expect(res.body.message).to.be.equal('"data" must be an object.');
  });

  it("should return 400 and an error message when the rule has a missing field", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({ rule: ruleWithMissingField, data: { name: "test" } });

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
    expect(res.body.message).to.be.equal('"field" is required.');
  });

  it("should return 400 and an error message when the rule field has an invalid field", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({ rule: ruleWithInvalidCondition, data: { name: "test" } });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
    expect(res.body.message).to.be.equal(
      '"condition" must be one of [eq, neq, gt, gte, contains].'
    );
  });

  it("should return 400 and an error message when the rule field doesn't exist in data", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({ rule, data: { name: "test" } });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
    expect(res.body.message).to.be.equal(
      "field missions is missing from data."
    );
  });
});
