import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from "react-toastify";
import { SignUpUserApi } from '../../Api/Api';
import marioBackground from '/Users/choenyitamang/Desktop/frontend-31a-duktar210143-master/src/Assets/Images/mario.png';

const defaultTheme = createTheme();

const PasswordStrengthBar = ({ password }) => {
  const calculateStrength = (password) => {
    let strength = 0;
    const regex = {
      digits: /\d/.test(password),
      lowerCase: /[a-z]/.test(password),
      upperCase: /[A-Z]/.test(password),
      nonWords: /\W/.test(password),
    };

    const conditionsMet =
      regex.digits + regex.lowerCase + regex.upperCase + regex.nonWords;

    strength += Math.min(conditionsMet, 3);

    if (password.length > 6) {
      strength += 1;
    }

    return strength;
  };

  const strength = calculateStrength(password);
  const progressBarWidth = `${(strength / 4) * 100}%`;

  return (
    <div style={{ display: password ? 'block' : 'none' }}>
      <div style={{ width: '100%', backgroundColor: 'lightgray', borderRadius: '5px', height: '10px', marginTop: '10px' }}>
        <div style={{ width: progressBarWidth, backgroundColor: strength === 4 ? 'darkgreen' : strength === 3 ? 'lightgreen' : strength === 2 ? 'yellow' : 'red', borderRadius: '5px', height: '100%' }}></div>
      </div>
      <div style={{ marginTop: '5px', fontSize: '12px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
        {strength === 4 ? 'Super Strong' : strength === 3 ? 'Strong' : strength === 2 ? 'Okay' : 'Weak'}
      </div>
    </div>
  );
};

const Signup = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setAlertMessage('Email must not be empty');
      return;
    }

    if (email.length < 5) {
      setAlertMessage('Email must have at least 5 characters');
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setAlertMessage('Password must be between 8 and 16 characters');
      return;
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      setAlertMessage('Password must contain at least one capital letter');
      return;
    }

    if (!/(?=.*\d)/.test(password)) {
      setAlertMessage('Password must contain at least one number');
      return;
    }

    if (!/(?=.*\W)/.test(password)) {
      setAlertMessage('Password must contain at least one special character');
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage("Confirm password doesn't match password");
      return;
    }

    const userData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username,
      password: password,
    };

    try {
      const res = await SignUpUserApi(userData);
      if (res.data.success === false) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error status:", error.response.status);
        console.error("Error message from the server:", error.response.data.message);
        toast.error(error.response.data.message);
      } else if (error.request) {
        console.error("No response received from the server");
        toast.error("No response received from the server");
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("Error setting up the request");
      }
    }
  };

  const handleInputChange = () => {
    setAlertMessage('');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <div style={{ width: '100vw', height: '100vh', backgroundImage: `url(${marioBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container component="main" maxWidth="xs" style={{ padding: 0, margin: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={firstname}
                    onChange={(e) => {
                      setFirstname(e.target.value);
                      handleInputChange();
                    }}
                    InputLabelProps={{ style: { color: 'white', fontWeight: 'bold' } }}
                    InputProps={{ style: { color: 'white' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={lastname}
                    onChange={(e) => {
                      setLastname(e.target.value);
                      handleInputChange();
                    }}
                    InputLabelProps={{ style: { color: 'white', fontWeight: 'bold' } }}
                    InputProps={{ style: { color: 'white' } }}
                  />
                </Grid>
                <Grid item xs={12}>
  <TextField
    required
    fullWidth
    id="username"
    label="Username"
    name="username"
    autoComplete="username"
    value={username}
    onChange={(e) => {
      setUsername(e.target.value);
      handleInputChange();
    }}
    InputLabelProps={{ style: { color: 'white', fontWeight: 'bold' } }}
    InputProps={{ style: { color: 'white' } }}
  />
</Grid>
<Grid item xs={12}>
  <TextField
    required
    fullWidth
    id="email"
    label="Email Address"
    name="email"
    autoComplete="email"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      handleInputChange();
    }}
    InputLabelProps={{ style: { color: 'white', fontWeight: 'bold' } }}
    InputProps={{ style: { color: 'white' } }}
  />
</Grid>
<Grid item xs={12}>
  <TextField
    required
    fullWidth
    name="password"
    label="Password"
    type="password"
    id="password"
    autoComplete="new-password"
    value={password}
    onChange={(e) => {
      setPassword(e.target.value);
      handleInputChange();
    }}
    InputLabelProps={{ style: { color: 'white', fontWeight: 'bold' } }}
    InputProps={{ style: { color: 'white' } }}
  />
</Grid>
<Grid item xs={12}>
  <TextField
    required
    fullWidth
    name="confirmPassword"
    label="Confirm Password"
    type="password"
    id="confirmPassword"
    autoComplete="new-password"
    value={confirmPassword}
    onChange={(e) => {
      setConfirmPassword(e.target.value);
      handleInputChange();
    }}
    InputLabelProps={{ style: { color: 'white', fontWeight: 'bold' } }}
    InputProps={{ style: { color: 'white' } }}
  />
</Grid>
<Grid item xs={12}>
  <FormControlLabel
    control={<Checkbox value="allowExtraEmails" color="primary" />}
    label="I want to receive inspiration, marketing promotions and updates via email."
  />
</Grid>
<Grid item xs={12}>
  <PasswordStrengthBar password={password} />
</Grid>
</Grid>
<Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{ mt: 3, mb: 2 }}
>
  Sign Up
</Button>
<Grid container justifyContent="flex-end">
  <Grid item>
    <Link href="/login" variant="body2" style={{ color: 'white' }}>
      Already have an account? Sign in
    </Link>
  </Grid>
</Grid>
{alertMessage && (
  <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
    {alertMessage}
  </Typography>
)}
</Box>
</Box>
</Container>
</div>
</ThemeProvider>
);
};

export default Signup;