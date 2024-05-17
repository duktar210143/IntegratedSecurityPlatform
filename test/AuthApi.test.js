const request = require("supertest");
const app = require("../index");

describe("API Testings", () => {
  // Making test for test route '/test'
  it("GET / test | Response with valid text", async () => {
    const response = await request(app).get("/test");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("hello");
  });

  let userToken;

  // Sign up a new user
  it("POST /signup | Sign up a new user", async () => {
    const response = await request(app).post("/api/signup").send({
      firstname: "John",
      lastname: "Doe",
      email: "johndoe@example.com",
      username: "johndoe47",
      password: "password123",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });

  // Log in with the newly created user
  it("POST /login | Log in with the new user", async () => {
    const response = await request(app).post("/api/login").send({
      username: "john",
      password: "john",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();

    // Save the token for future requests
    userToken = response.body.token;
  });

  // Test access to protected routes using the token
  it("GET /api/getAllUsers | Get all users with token", async () => {
    const response = await request(app)
      .get("/api/getAllUsers")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.users).toBeTruthy();
  });
});
