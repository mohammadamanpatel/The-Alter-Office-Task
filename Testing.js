import request from "supertest";
import { expect } from "chai";
import app from "./server.js"; // Assuming your Express app is exported from server.js
import Url from "./models/Url.model.js";
import redisclient from "./config/Redis.config.js";

describe("URL Shortening API", function () {
  this.timeout(5000); // Increasing timeout to 5000ms
  let token;
  let alias;
  let topic = "testTopic";

  before((done) => {
    // jwt token for user data 
    token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTMyYmIzOGU4Y2ZmMjBhMzZmNmFkYyIsImdvb2dsZUlkIjoiMTE2NTUxODk4MDgzODgzODI1NTg3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzg4NDAzOTEsImV4cCI6MTc0NzQ4MDM5MX0.8AhBMys5gJ0I6DT4ROJiH7bNSeSL-BseKtZPsNot2j0";
    done();
  });

  after(async () => {
    // Cleaning up the database after tests
    await Url.deleteMany({});
    await redisclient.flushall(); // Clearing Redis cache after every test
  });

  describe("POST /auth/url/shorten", () => {
    it("should create a short URL", (done) => {
      request(app)
        .post("/auth/url/shorten")
        .query({ token })
        .send({
          longUrl: "http://test.com",
          customAlias: "testAlias",
          topic: "testTopic",
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property("shortUrl");
          alias = res.body.alias;
          done();
        });
    });
  });

  describe("GET /auth/url", () => {
    it("should get user URLs", (done) => {
      request(app)
        .get("/auth/url")
        .query({ token })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });

  describe("GET /auth/url/analytics/:alias", () => {
    it("should get URL analytics", (done) => {
      request(app)
        .get(`/auth/url/analytics/${alias}`)
        .query({ token })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("totalClicks");
          done();
        });
    });
  });

  describe("GET /auth/url/analytics/topic/:topic", () => {
    it("should get topic analytics", (done) => {
      request(app)
        .get(`/auth/url/analytics/topic/${topic}`)
        .query({ token })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("totalClicks");
          done();
        });
    });
  });

  describe("GET /auth/url/overallAnalytics", () => {
    it("should get overall analytics", (done) => {
      request(app)
        .get("/auth/url/overallAnalytics")
        .query({ token })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("totalUrls");
          done();
        });
    });
  });

  describe("GET /auth/url/:alias", () => {
    it("should redirect to the original URL", (done) => {
      request(app)
        .get(`/auth/url/${alias}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("longUrl");
          done();
        });
    });
  });

  describe("DELETE /auth/url/delete/:alias", () => {
    it("should delete a short URL", (done) => {
      request(app)
        .delete(`/auth/url/delete/${alias}`)
        .query({ token })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property(
            "message",
            "Short URL deleted successfully"
          );
          done();
        });
    });
  });
});
