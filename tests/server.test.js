const request = require("supertest");
const expect = require("chai").expect;

const app = require("../server");
const User = require("../models/User");

// expect({a: 1}).to.have.own.property('a');
// expect({a: 1}).to.have.property('b');
// expect({a: 1}).to.not.have.own.property('b');

// expect({a: 1}).to.own.include({a: 1});
// expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
// var expect = chai.expect;

// expect(foo).to.be.a('string');
// expect(foo).to.equal('bar');
// expect(foo).to.have.lengthOf(3);
// expect(tea).to.have.property('flavors')
//   .with.lengthOf(3);
describe("api/v0/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /signup", function () {
    it("Should create and return a users", async function () {
      let data = {
        email: "hi@johndoe.com",
        password: "$0m3Rand0mPa55",
      };

      let res = await request(app).post("/auth/register").send(data);
      console.log(res._body.data.roles);
      expect(res.status).to.equal(201);
      expect(res._body.data).to.have.property("email", data.email);
      expect(res._body.data).to.have.property("active", true);
      expect(res._body.data).to.have.property("isVerified", false);
      expect(res._body.data).to.have.property("roles").with.lengthOf(1);
    });
    // it("Should not create a user", async function() {
    //     let data = {
    //         email: "hi@johndoe.com"
    //     }
    //     let res = await request(app).post("auth/register").send(data);
    //     console.log(res._body)
    //     expect(res.status).to.equal(404);
    //     expect(res._body).to.have.property("message", 'All fields are required');

    // })
  });
});
