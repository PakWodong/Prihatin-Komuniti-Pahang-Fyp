import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../image/th-removebg-preview.png';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterVolunteer() {
    const location = useLocation();
    const volunteerid = location.state.volunteerid;
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [username, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setEmail(localStorage.getItem("email"));
        setName(localStorage.getItem("username"));
        setUserId(localStorage.getItem("user_id"));
    });

    const handleError = (error) => {
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

    const handleSuccess = (message) => {
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

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!description) {
            setDescriptionError('Enter a Description');
            return;
        } else {
            setDescriptionError('');
        }

        const data = {
            name: username,
            email: email,
            status: "Pending",
            description: description,
            activity: volunteerid,
            user: userId
        };
        setIsLoading(true);
        axios.post(`${process.env.REACT_APP_API_URL}/donationactivity/volunteerParticipant/`, data)
            .then(response => {
                console.log(response.data);
                if (response.data.success) {
                    handleSuccess(response.data.message);
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                }
                else {
                    setIsLoading(false);
                    handleError(response.data.error);
                }
            })
            .catch(error => {
                setIsLoading(false);
                console.error(error);
                handleError('Something went wrong. Please try again');
            });
    };

    return (
        <div>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="top">
                <div className="topInfo">
                    <h2 >Add Donation Transaction Page</h2>
                    <div className="Prihatin">
                        | {localStorage.getItem('username')}
                    </div>
                </div>
                <div className="formcontainer">
                    <img src={logo} alt="Logo" className='formlogo' />
                    <div className="form-container">
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ mt: 1, ml: 30, display: 'flex', flexDirection: 'column', alignItems: 'left' }}
                            noValidate
                            autoComplete="off"
                        >
                            <h4>Name</h4>
                            <TextField
                                required
                                fullWidth
                                id="name"
                                name="name"
                                autoComplete="name"
                                value={username}
                                onChange={setName}
                                readOnly={true}
                                sx={{ mb: 2, width: '80%' }}
                            />
                            <h4>Email</h4>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={setEmail}
                                readOnly={true}
                                sx={{ mb: 2, width: '80%' }}
                            />
                            <h4>Description (Reason to Participate)</h4>
                            <TextField
                                required
                                fullWidth
                                id="description"
                                name="description"
                                type="text"
                                value={description}
                                error={Boolean(descriptionError)}
                                helperText={descriptionError}
                                onChange={(e) => setDescription(e.target.value)}
                                sx={{ mb: 5, width: '80%' }}
                                multiline
                                rows={4}
                                readOnly={false}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant="contained"
                                className='buttonStyle'
                            >
                                {isLoading ? 'Processing...' : 'Submit'}
                            </Button>

                        </Box>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RegisterVolunteer