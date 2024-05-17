const request = require("supertest");
const app = require("../index");

describe("API Testings", () => {

  // question Api test
  // testing the question creating
  it("POST /api/setQuestions | Upload a question", async () => {
    const response = await request(app)
      .post("/api/questions/setQuestions")
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJpYXQiOjE3MDkyMDQ3MDN9.aD1AWx21db34aK06Jbeh_8SOuKguc2PluF0R9UHAF0Q"
      ) // Set the authentication token here
      .send({
        question: "Test question",
        questionDescription: "Description of the test question",
        questionCategory: "Test category",
      });

    expect(response.statusCode).toBe(200); // Assuming you return 200 on success
    expect(response.body.success).toBe(true);
    expect(response.body.question).toBeTruthy();
  });
  
  // testing fetching question
  it("GET /api/questions/getAllQuestions | Fetch all questions", async () => {
    const response = await request(app)
      .get("/api/questions/getAllQuestions")
      .set("x-access-token", 
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJpYXQiOjE3MDkyMDQ3MDN9.aD1AWx21db34aK06Jbeh_8SOuKguc2PluF0R9UHAF0Q"); // Set the authentication token here

    expect(response.statusCode).toBe(200); // Assuming you return 200 on success
    expect(response.body.success).toBe(true);
    expect(response.body.questions).toBeTruthy();
  });

  it("PUT /api/questions/:id | Edit a question", async () => {
    // Create a new question to edit
    const newQuestion = await request(app)
      .post("/api/questions/setQuestions")
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJpYXQiOjE3MDkyMDQ3MDN9.aD1AWx21db34aK06Jbeh_8SOuKguc2PluF0R9UHAF0Q"
      )
      .send({
        question: "Test question",
        questionDescription: "Test question description",
      });
  
    // Edit the question
    const editedQuestion = await request(app)
      .put(`/api/questions/updateUserQuestion/${newQuestion.body.question._id}`)
      .set("x-access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJpYXQiOjE3MDkyMDQ3MDN9.aD1AWx21db34aK06Jbeh_8SOuKguc2PluF0R9UHAF0Q")
      .send({
        question: "Edited question",
        questionDescription: "Edited question description",
      });
  
    // Assert the response
    expect(editedQuestion.statusCode).toBe(200);
    expect(editedQuestion.body.success).toBe(true);
    expect(editedQuestion.body.message).toBe("UserQuestion updated successfully");
    expect(editedQuestion.body.question.question).toBe("Edited question");
    expect(editedQuestion.body.question.questionDescription).toBe("Edited question description");
  });
  
  
});
