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
        axios.post(`${process.env.REACT_APP_API_URL}donationactivity/volunteerParticipant/`, data)
            .then(response => {
                console.log(response.data);
                if (response.data.success) {
                    handleSuccess(response.data.message);
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                }
                else {
                    handleError(response.data.error);
                  }
            })
            .catch(error => {
                console.error(error);
                handleError('Something went wrong. Please try again');
            });
    };

    return (
        <div>
            <div style={{ marginLeft: "240px", marginTop: "2%" }}>
                <div style={{ display: 'inline-block', width: '100%', marginBottom: "3%" }}>
                    <h2 style={{ display: 'inline-block' }}>Home Page</h2>
                    <div style={{ display: 'inline-block', textAlign: 'right', margin: '10px 20px', position: 'absolute', top: 0, right: 0 }}>
                        | Prihatin Komuniti Pahang
                    </div>
                </div>
                <img src={logo} alt="Logo" style={{ height: '250px', display: 'block', margin: 'auto' }} />
                <div className="form-container" style={{ height: 'auto', margin: 'auto' }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 1, ml: 18, display: 'flex', flexDirection: 'column', alignItems: 'left', width: '100%' }}
                        noValidate
                        autoComplete="off"
                    >
                        <h4 style={{ fontWeight: "normal" }}>Name</h4>
                        <TextField
                            required
                            fullWidth
                            id="name"
                            name="name"
                            autoComplete="name"
                            value={username}
                            onChange={setName}
                            readOnly={true}
                            sx={{ mt: 1, mb: 3, width: '80%' }}
                        />
                        <h4 style={{ fontWeight: "normal" }}>Email</h4>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={setEmail}
                            readOnly={true}
                            sx={{ mt: 1, mb: 3, width: '80%' }}
                        />
                        <h4 style={{ fontWeight: "normal" }}>Description (Reason to Participate)</h4>
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
                            sx={{ mb: 4, width: '80%' }}
                            multiline
                            rows={4}
                            readOnly={false}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            className='buttonStyle'
                        >
                            Submit
                        </Button>

                    </Box>
                </div>
            </div>
        </div>
    )
}
export default RegisterVolunteer