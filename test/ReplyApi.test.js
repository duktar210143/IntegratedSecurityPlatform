const request = require("supertest");
const app = require("../index");
const Reply = require("../models/Reply.model");
const Question = require("../models/Question.model");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

describe("Reply Controller", () => {
  let userToken;
  let questionId = "65e0640b62162187cad0dafd";

  beforeEach(async () => {
    // Log in to get a valid token
    const response = await request(app)
      .post("/api/login")
      .send({ username: "duktar", password: "duktar" });
    userToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJpYXQiOjE3MDkyMDQ3MDN9.aD1AWx21db34aK06Jbeh_8SOuKguc2PluF0R9UHAF0Q";
  });

  describe("POST /api/reply/:questionId", () => {
    it("should add a new reply to a question", async () => {
      // Create a new reply
      // Set the x-access-token header
      const response = await request(app)
        .post(`/api/questions/setreply/${questionId}`)
        .set("x-access-token", userToken)
        .send({ reply: "Test reply" });

      expect(response.status).toBe(200);
      // Add more assertions as needed
    });
  });

  describe("GET /api/questions/getReplies/:questionId", () => {
    it("should get all replies for a question", async () => {
      // Get all replies for a question
      // Set the x-access-token header
      const response = await request(app)
        .get(`/api/questions/getReplies/${questionId}`)
        .set("x-access-token", userToken);

      expect(response.status).toBe(200);
      // Add more assertions as needed
    });
  });
});
