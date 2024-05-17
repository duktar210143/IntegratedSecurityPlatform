import axios from "axios";

const Api = axios.create({
  baseURL: "https://localhost:5500",
  withCredentials: true,
  // Remove Content-Type header from the default headers
});

export const SignUpUserApi = (data) => Api.post("/api/signup", data);
export const LoginUserApi = (data) => Api.post("/api/login", data);
export const createQuestion = (data, headers) =>
  Api.post("/api/questions/setQuestions", data, { headers });
export const fetchQuestion = (headers) =>
  Api.get("/api/questions/getQuestions", { headers });
export const fetchAllQuestions = () =>
  Api.get("/api/questions/getAllQuestions");
export const setReply = (questionId, data, headers) =>
  Api.post(`/api/questions/setReply/${questionId}`, data, { headers });
export const getReplies = (questionId, headers) =>
  Api.get(`/api/questions/getReplies/${questionId}`, { headers });
export const deleteQuestion = (questionId, headers) =>
  Api.delete(`api/questions/deleteQuestion/${questionId}`, { headers });
export const forgotPassword = (data) => Api.post("/api/user/forgot_password", data);
