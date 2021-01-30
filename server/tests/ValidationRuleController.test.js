import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";
import "babel-polyfill";

const { expect } = chai;
chai.use(chaiHttp);

const rule = {
  field: "age",
  condition: "gte",
  condition_value: 30,
};

const data = {
  name: "James Holden",
  crew: "Rocinante",
  age: 34,
  position: "Captain",
  missions: {
    count: 45,
    successful: 44,
    failed: 1,
  },
};

describe("POST /validate-rule", () => {
  it("should return 200 and a successfully validate data", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({ rule, data });
    expect(res).to.have.status(200);
    expect(res.body.status).to.be.equal("success");
  });

  it("should return 400 and not successfully validate data", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({
        rule: { field: "age", condition: "eq", condition_value: 30 },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 318,
          position: "Captain",
        },
      });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
  });

  it("should return 400 and not successfully validate data", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({
        rule: { field: "age", condition: "neq", condition_value: 30 },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 30,
          position: "Captain",
        },
      });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
  });

  it("should return 200 and a successfully validate data", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({
        rule: { field: "age", condition: "gt", condition_value: 30 },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 35,
          position: "Captain",
        },
      });
    expect(res).to.have.status(200);
    expect(res.body.status).to.be.equal("success");
  });

  it("should return 400 and not successfully validate data if field is missing in data", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({
        rule: {
          field: "5",
          condition: "contains",
          condition_value: "rocinante",
        },
        data: ["The Nauvoo", "The Razorback", "The Roci", "Tycho"],
      });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
    expect(res.body.message).to.be.equal("field 5 is missing from data.");
    expect(res.body.data).to.be.equal(null);
  });

  it("should return 400 and not successfully validate data if field doesn't exist in data", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({
        rule: {
          field: "0",
          condition: "eq",
          condition_value: "a",
        },
        data: "damien-marley",
      });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
    expect(res.body.message).to.be.equal("field 0 failed validation.");
    expect(res.body.data).to.be.an("object");
  });

  it("should return 400 and not successfully validate data if field doesn't exist in data nested object", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({
        rule: {
          field: "missions.count",
          condition: "gte",
          condition_value: 30,
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            age: 45,
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal("error");
    expect(res.body.message).to.be.equal(
      "field count is missing from data.missions."
    );
    expect(res.body.data).to.be.equal(null);
  });

  it("should return 200 and successfully validate data if field exist in data nested object", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({
        rule: {
          field: "missions.count",
          condition: "gte",
          condition_value: 30,
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            count: 45,
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res).to.have.status(200);
    expect(res.body.status).to.be.equal("success");
    expect(res.body.message).to.be.equal(
      "field missions.count successfully validated."
    );
    expect(res.body.data).to.be.an("object");
  });

  it("should return 200 and successfully validate data if field contains in data nested object", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/validate-rule")
      .send({
        rule: {
          field: "missions.count",
          condition: "contains",
          condition_value: 30,
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            count: [45, 30, 12],
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res).to.have.status(200);
    expect(res.body.status).to.be.equal("success");
    expect(res.body.message).to.be.equal(
      "field missions.count successfully validated."
    );
    expect(res.body.data).to.be.an("object");
  });
});
