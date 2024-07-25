import React, { useState } from "react";
import "./ResetPasswordForm.css"; // CSS file for styling
import AppBar from "../../Components/AppBar/AppBar";
import { forgotPassword } from "../../Api/Api";
import { toast } from "react-toastify";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic here for sending the OTP request and resetting the password
    console.log("Email:", email);
    forgotPassword({ email })
      .then((res) => {
        toast.success("check your email form password link");
      })
      .catch((err) => {
        console.log(err);
        toast.error("something went wrong");
      });
    // Reset the form fields
    setEmail("");
  };

  return ( 
    <>
      <AppBar />
      <div className="reset-password-form-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="reset-button">
            Send OTP Request
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPasswordForm;
