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

function DonationRequest() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');

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

    const handleRequestDonation = async (e) => {
        e.preventDefault();
        if (!name) {
            handleLoginError('Please enter your name');
            return;
        }
        if (!email) {
            handleLoginError("Email is required");
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            handleLoginError("Invalid email address");
            return;
        }
        if (!description) {
            handleLoginError('Please enter your description');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}donation/request/`, { email, name, description });

            if (response.data.success) {
                handleLoginSucess(response.data.message)
                setTimeout(() => {
                    window.location.href = '/login'; // Redirect to home page
                }, 3000);
            } else {
                handleLoginError(response.data.error)
            }
        } catch (error) {
            handleLoginError('An error occured while request the donation. Please try again');
            console.error(error);
        }
    };

    return (
        <div className="form-container" style={{ height: '100vh' }}>
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
                            maxWidth: '800px',
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        <img src={logo} alt="Logo" style={{ height: '100px' }} />
                        <Typography variant="h4" gutterBottom>
                            Donation Request
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleRequestDonation}
                            sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{ mb: 2, width: '80%' }}
                            />
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2, width: '80%' }}
                            />
                            <TextField
                                required
                                fullWidth
                                id="description"
                                label="Description (Reason to Request Donation)"
                                name="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                sx={{ mb: 2, width: '80%' }}
                                multiline
                                rows={4}
                            />
                            <Button type="submit" variant="contained" sx={{ width:"80%",mt: 2,p:1 }}className="authbutton">
                                Request Donation
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </ThemeProvider>
        </div>
    );
}

export default DonationRequest;
