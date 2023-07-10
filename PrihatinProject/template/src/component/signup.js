import React, { useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField } from "@mui/material";
import logo from '../image/th-removebg-preview.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();


function SignUpPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [location, setLocation] = useState("");
    const [locationOther, setLocationOther] = useState("");
    const [profession, setProfession] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [nameError, setNameError] = useState("");
    const [contactNumberError, setContactNumberError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [professionError, setProfessionError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError("");
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
        setNameError("");
    };

    const handleContactNumberChange = (event) => {
        setContactNumber(event.target.value);
        setContactNumberError("");
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
        setLocationError("");
    };

    const handleLocationOtherChange = (event) => {
        setLocationOther(event.target.value);
    };

    const handleProfessionChange = (event) => {
        setProfession(event.target.value);
        setProfessionError("");
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError("");
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setConfirmPasswordError("");
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

        // Validate fields
        let errors = false;

        if (!email) {
            setEmailError("Email is required");
            errors = true;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Invalid email address");
            errors = true;
        }

        if (!name) {
            setNameError("Name is required");
            errors = true;
        }

        if (!contactNumber) {
            setContactNumberError("Contact number is required");
            errors = true;
        } else if (!/^\d+$/.test(contactNumber)) {
            setContactNumberError("Invalid contact number");
            errors = true;
        }

        if (!location) {
            setLocationError("Location is required");
            errors = true;
        }

        if (!profession) {
            setProfessionError("Profession is required");
            errors = true;
        }

        if (!password) {
            setPasswordError("Password is required");
            errors = true;
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            errors = true;
        } else if (!/\d/.test(password)) {
            setPasswordError("Password must contain at least one number");
            errors = true;
        } else if (!/[a-z]/.test(password)) {
            setPasswordError("Password must contain at least one lowercase letter");
            errors = true;
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one uppercase letter");
            errors = true;
        } else if (!/[^A-Za-z0-9]/.test(password)) {
            setPasswordError("Password must contain at least one special character");
            errors = true;
        } else {
            setPasswordError("");
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm password");
            errors = true;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            errors = true;
        }

        if (!errors) {
            setIsLoading(true);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/register/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user: {
                            email: email,
                            username: name,
                            password: password,
                        },
                        contact_number: contactNumber,
                        location: location,
                        profession: profession,
                    })
                });

                if (!response.ok) {
                    const data = await response.json();
                    setIsLoading(false);
                    handleLoginError(data.error);
                    throw new Error(response.statusText);
                }

                const data = await response.json();
                handleLoginSucess(data.message);

                setTimeout(() => {
                    window.location.href = '/login'; // Redirect to login page
                }, 5000);
            } catch (error) {
                setIsLoading(false);
                console.error(error);
                //handleLoginError('An error occurred while sign up. Please try again');
            }
        }
    };


    return (
        <div style={{ backgroundColor: "#f0f0f0" }}>
            {isLoading && (
                <div className="m-loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                    }}
                >
                    <div style={{ position: "relative" }}>
                        <Paper
                            elevation={6}
                            sx={{
                                margin: "auto",
                                padding: "32px",
                                maxWidth: "600px",
                                width: "100%",
                                marginTop: "50px",
                            }}
                        >
                            <div style={{ position: 'relative' }}>
                                <Typography variant="h4" gutterBottom>
                                    Sign Up
                                </Typography>
                                <img src={logo} alt="Logo" style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', height: '100px', marginLeft: '0px' }} />
                            </div>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{ mt: 2 }}
                                noValidate
                                autoComplete="off"
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email"
                                            name="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            error={Boolean(emailError)}
                                            helperText={emailError}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="name"
                                            label="Username"
                                            name="name"
                                            autoComplete="name"
                                            value={name}
                                            onChange={handleNameChange}
                                            error={Boolean(nameError)}
                                            helperText={nameError}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="contact-number"
                                            label="Contact Number"
                                            name="contact-number"
                                            autoComplete="tel"
                                            value={contactNumber}
                                            onChange={handleContactNumberChange}
                                            error={Boolean(contactNumberError)}
                                            helperText={contactNumberError}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(locationError)}>
                                            <InputLabel id="location-label">Location</InputLabel>
                                            <Select
                                                labelId="location-label"
                                                id="location"
                                                name="location"
                                                value={location}
                                                onChange={handleLocationChange}
                                            >
                                                <MenuItem value="Johor">Johor</MenuItem>
                                                <MenuItem value="Kedah">Kedah</MenuItem>
                                                <MenuItem value="Kelantan">Kelantan</MenuItem>
                                                <MenuItem value="Kuala Lumpur">Kuala Lumpur</MenuItem>
                                                <MenuItem value="Labuan">Labuan</MenuItem>
                                                <MenuItem value="Melaka">Melaka</MenuItem>
                                                <MenuItem value="Negeri Sembilan">Negeri Sembilan</MenuItem>
                                                <MenuItem value="Pahang">Pahang</MenuItem>
                                                <MenuItem value="Perak">Perak</MenuItem>
                                                <MenuItem value="Perlis">Perlis</MenuItem>
                                                <MenuItem value="Pulau Pinang">Pulau Pinang</MenuItem>
                                                <MenuItem value="Sabah">Sabah</MenuItem>
                                                <MenuItem value="Sarawak">Sarawak</MenuItem>
                                                <MenuItem value="Selangor">Selangor</MenuItem>
                                                <MenuItem value="Terengganu">Terengganu</MenuItem>
                                                <MenuItem value="Others">Others</MenuItem>
                                            </Select>
                                            {locationError && <FormHelperText>{locationError}</FormHelperText>}
                                            {location === 'Others' && (
                                                <TextField
                                                    fullWidth
                                                    id="location-other"
                                                    name="location-other"
                                                    label="Please Specify"
                                                    value={locationOther}
                                                    onChange={handleLocationOtherChange}
                                                />
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="profession"
                                            label="Profession"
                                            name="profession"
                                            autoComplete="off"
                                            value={profession}
                                            onChange={handleProfessionChange}
                                            error={Boolean(professionError)}
                                            helperText={professionError}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="password"
                                            label="Password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            error={Boolean(passwordError)}
                                            helperText={passwordError}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="confirm-password"
                                            label="Confirm Password"
                                            name="confirm-password"
                                            type="password"
                                            autoComplete="current-password"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            error={Boolean(confirmPasswordError)}
                                            helperText={confirmPasswordError}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            className="authbutton"
                                            disabled={isLoading}
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            {isLoading ? 'Processing...' : 'Sign Up'}
                                        </Button>
                                        <Grid container justifyContent="flex-end">
                                            Already have an account?
                                            <Grid item>
                                                <Link href="/login" variant="body2" style={{ textDecoration: 'none' }} className="link">
                                                    Sign in
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </div>
                </Box>
            </ThemeProvider>
        </div>
    );
}

export default SignUpPage;