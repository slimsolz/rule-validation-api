import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";
import "babel-polyfill";

const { expect } = chai;
chai.use(chaiHttp);

const info = {
  name: "Odumah Solomon",
  github: "@slimsolz",
  email: "odumahs@gmail.com",
  mobile: "08138826540",
  twitter: "@slimsolz",
};

describe("GET /", () => {
  it("should return 200 and a welcome message", async () => {
    const res = await chai.request(app).get("/api/v1/");
    expect(res).to.have.status(200);
    expect(res.body.message).to.be.equal("My Rule-Validation API");
    expect(res.body.status).to.be.equal("success");
    expect(res.body.data).to.be.an("object");
    expect(res.body.data.name).to.be.equal(info.name);
    expect(res.body.data.github).to.be.equal(info.github);
    expect(res.body.data.email).to.be.equal(info.email);
    expect(res.body.data.mobile).to.be.equal(info.mobile);
    expect(res.body.data.twitter).to.be.equal(info.twitter);
  });
});

describe("GET /xoxo", () => {
  it("should return 404 and an error message", async () => {
    const res = await chai.request(app).get("/api/v1/xyz");
    expect(res).to.have.status(404);
    expect(res.body.message).to.be.equal("404 Page not found.");
    expect(res.body.status).to.be.equal("error");
    expect(res.body.data).to.be.equal(null);
  });
});
