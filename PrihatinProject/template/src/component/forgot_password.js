import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField } from "@mui/material";
import Paper from '@mui/material/Paper';
import logo from '../image/th-removebg-preview.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleLoginError = (error) => {
    toast.error(
      <div className="custom-toast">
        <div className="custom-toast-icon" />
        {error}
      </div>,
      {
        className: 'custom-toast-container',
        closeButton: false,
      }
    );
  };

  const handleLoginSucess = (message) => {
    toast.success(
      <div className="custom-toast">
        <div className="custom-toast-icon" />
        {message}
      </div>,
      {
        className: 'custom-toast-container',
        closeButton: false,
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}forgot_password/`, { email }, { withCredentials: true });
      if (response.data.success) {
        handleLoginSucess(response.data.message)
        setTimeout(() => {
          window.location.href = '/login'; // Redirect to home page
      }, 3000);
      } else {
        setIsLoading(false);
        handleLoginError(response.data.error);
      }
    } catch (error) {
      setIsLoading(false);
      handleLoginError('An error occured while sending the reset password link to your email. Please try again')
      console.error(error);
    }
  };

  return (
    <div className="form-container" style={{ height: '100vh' }}>
      {isLoading && (
        <div className="m-loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            height: '100%',
            width: '100%',
          }}
        >
          <Paper
            elevation={6}
            sx={{
              margin: 'auto',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              marginTop: '10%',
              textAlign: 'center',
            }}
          >
            <img src={logo} alt="Logo" style={{ height: '100px' }} />
            <Typography variant="h4" gutterBottom>
              Forgot Password
            </Typography>
            <Typography variant="h7" gutterBottom>
              Enter your email address
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
              noValidate
              autoComplete="off"
            >
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                sx={{ mb: 2, width: '80%' }}
              />
              <Button
                className="authbutton"
                type="submit"
                disabled={isLoading}
                variant="contained"
                sx={{ width: '80%' }}
              >
                {isLoading ? 'Processing...' : 'Continue'} 
              </Button>
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </div>
  );

}

export default ForgotPasswordForm;
