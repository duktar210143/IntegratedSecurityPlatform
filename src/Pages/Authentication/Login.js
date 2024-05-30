// import React, { useState } from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router";
// import { toast } from "react-toastify";
// import AppBar from "../../Components/AppBar/AppBar";
// import backgroundImage from "../../Assets/Images/mario_login.png";
// import { LoginUserApi } from "../../Api/Api";

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   width: 100vw;
//   background: #eaf6f6;
//   background-image: url(${backgroundImage});
//   background-size: cover;
// `;

// const Content = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   margin-bottom: 80px;
//   flex-grow: 1; /* Allow content to grow and take up available space */
// `;

// const StyledInputDiv = styled.div`
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   margin-top: 20px;

//   & input {
//     margin-bottom: 10px;
//     width: 500px;
//     height: 50px;
//     font-size: 15px;
//     border-radius: 10px;
//     border: 5px solid;
//     padding-left: 20px;
//   }
// `;

// const StyledButton = styled.button`
//   width: 170px;
//   height: 50px;
//   color: white;
//   background-color: rgb(89, 4, 4);
//   font-size: 25px;
//   font-weight: bold;
//   padding-left: 40px;
//   margin-top: 20px;
//   margin-left: 190px;
//   border-radius: 20px;
//   border: 5px solid;
//   display: flex;
//   align-item: center;
//   flex-direction: column;
//   justify-content: center;
// `;
// const ForgotPasswordContainer = styled.div`
//   margin-left: 150px;
//   max-width: 250px;
//   display: inline-block;
//   background-color: rgb(75, 147, 209);
//   padding: 15px 20px;
//   border: 2px solid white;
//   border-radius: 5px;
//   transition: background-color 0.3s;
//   margin-top: 20px;
//   cursor: pointer;
//   color: black;

//   &:hover {
//     background-color: white;
//   }
// `;

// const ForgotPasswordLink = styled.a`
//   color: inherit;
//   text-decoration: none;
//   font-weight: bold;

//   &:hover {
//     color: blue;
//   }
// `;

// const Login = () => {
//   const [username, setUserName] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   async function loginUser(event) {
//     event.preventDefault();

//     try {
//       const data = {
//         username: username,
//         password: password,
//       };

//       LoginUserApi(data).then((res) => {
//         if (res.data.success === false) {
//           toast.error(res.data.message);
//           navigate("/login");
//         } else {
//           toast.success(res.data.message);
//           // Set the token to local storage
//           localStorage.setItem("token", res.data.token);
//           // Set user data
//           const jsonDecoded = JSON.stringify(res.data.userData);
//           localStorage.setItem("user", jsonDecoded);

//           // Check password expiry
//           const passwordCreated = new Date(res.data.userData.passwordCreated);
//           const now = new Date();
//           const passwordAge = now - passwordCreated;
//           const ninetyDaysInMilliseconds = 90 * 24 * 60 * 60 * 1000;

//           if (passwordAge > ninetyDaysInMilliseconds) {
//             toast.error("Your password has expired. Please change your password.");
//             navigate("/resetPwForm"); // Navigate to the password reset form
//           } else {
//             navigate("/dashboard");
//           }
//         }
//       }).catch((error) => {
//         if (error.response) {
//           console.error("API response error:", error.response);
//           toast.error(`Error: ${error.response.data.message}`);
//         } else {
//           console.error("API request error:", error);
//           toast.error("Server error. Please try again later.");
//         }
//       });
//     } catch (error) {
//       console.error("Server error", error);
//       toast.error("Server error. Please try again later.");
//     }
//   }

//   return (
//     <Container>
//       <Content>
//         <form onSubmit={loginUser}>
//           <StyledInputDiv>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUserName(e.target.value)}
//               placeholder="Email"
//             />
//           </StyledInputDiv>
//           <StyledInputDiv>
//             <input
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               type="password"
//               placeholder="Password"
//             />
//           </StyledInputDiv>
//           <StyledButton type="submit">Login</StyledButton>
//           <ForgotPasswordContainer>
//             <ForgotPasswordLink href="/resetPwForm">
//               Forgot your password? Reset
//             </ForgotPasswordLink>
//           </ForgotPasswordContainer>
//         </form>
//       </Content>
//     </Container>
//   );
// };
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import backgroundImage from "../../Assets/Images/mario_login.png";
import { LoginUserApi } from "../../Api/Api";
import { toast } from "react-toastify";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #eaf6f6;
  background-image: url(${backgroundImage});
  background-size: cover;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 80px;
  flex-grow: 1;
`;

const StyledInputDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  & input {
    margin-bottom: 10px;
    width: 500px;
    height: 50px;
    font-size: 15px;
    border-radius: 10px;
    border: 5px solid;
    padding-left: 20px;
  }
`;

const StyledButton = styled.button`
  width: 170px;
  height: 50px;
  color: white;
  background-color: rgb(89, 4, 4);
  font-size: 25px;
  font-weight: bold;
  padding-left: 40px;
  margin-top: 20px;
  margin-left: 190px;
  border-radius: 20px;
  border: 5px solid;
  display: flex;
  align-item: center;
  flex-direction: column;
  justify-content: center;
`;

const ForgotPasswordContainer = styled.div`
  margin-left: 150px;
  max-width: 250px;
  display: inline-block;
  background-color: rgb(75, 147, 209);
  padding: 15px 20px;
  border: 2px solid white;
  border-radius: 5px;
  transition: background-color 0.3s;
  margin-top: 20px;
  cursor: pointer;
  color: black;

  &:hover {
    background-color: white;
  }
`;

const ForgotPasswordLink = styled.a`
  color: inherit;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    color: blue;
  }
`;

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();

    try {
      const data = {
        username: username,
        password: password,
      };

      const res = await LoginUserApi(data);

      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        const jsonDecoded = JSON.stringify(res.data.user);
        localStorage.setItem("user", jsonDecoded);
        navigate("/dashboard");
      } else {
        toast.error(res.data.message);
        if (res.data.limitExceeded) {
          navigate("/login");
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  }

  return (
    <Container>
      <Content>
        <form onSubmit={loginUser}>
          <StyledInputDiv>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
            />
          </StyledInputDiv>
          <StyledInputDiv>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </StyledInputDiv>
          <StyledButton type="submit">Login</StyledButton>
          <ForgotPasswordContainer>
            <ForgotPasswordLink href="/resetPwForm">
              Forgot your password? Reset
            </ForgotPasswordLink>
          </ForgotPasswordContainer>
        </form>
      </Content>
    </Container>
  );
};

export default Login;
