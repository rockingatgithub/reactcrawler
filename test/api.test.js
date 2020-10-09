// ======================acquiring chai and other libraries======================

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { expect } = require("chai");
chai.use(chaiHttp);

// ======================================checking the required routes of the API=======================

describe("Get user tags from database", () => {
  it("It should return tags from database", async () => {
    const response = await chai
      .request("http://localhost:9000")
      .get("/users/getTags");
    expect(response).to.have.status(200);
    // console.log(response);
    expect(response.body.message).to.equals(
      "Here is list of tags of user interests"
    );
    expect(response.body.tags).to.be.a("array");
    expect(response.body.suggestedTags).to.be.a("array");
  });
});

describe("Fetch blogs array with provided tag", () => {
  it("It should return array of blogs", async () => {
    const response = await chai
      .request("http://localhost:9000")
      .get("/getPage/tag/linux");
    expect(response).to.have.status(200);
    expect(response.body.message).to.equals("Page fetched");
    expect(response.body.pageResponse.hrefListArray).to.be.a("array");
  });
});

describe("Fetch a blog with provided URL", () => {
  it("It should return post objects", async () => {
    const response = await chai
      .request("http://localhost:9000")
      .get("/getPage")
      .query({
        url:
          "https://medium.com/hackernoon/5-must-ask-questions-for-estimating-a-linux-embedded-project-5e425cdafdfd?source=---------0-----------------------",
      });
    expect(response).to.have.status(200);
    expect(response.body.message).to.equals("Page fetched");
    expect(response.body.pageResponse).to.be.a("object");
  });
});
