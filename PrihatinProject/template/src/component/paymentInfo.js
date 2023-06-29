import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import logo from '../image/th-removebg-preview.png';
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

function PaymentInfo() {
    const location = useLocation();
    const [donorName, setDonorName] = useState('');
    const [donorNameError, setDonorNameError] = useState('');
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const purpose = location.state.event;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!donorName) {
            setDonorNameError('Please enter a donor name.');
            return;
        } else {
            setDonorNameError('');
        }

        if (!amount || parseFloat(amount) <= 2) {
            setAmountError('Please enter a valid amount.');
            return;
        } else if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
            setAmountError('Please enter a valid number.');
            return;
        } else {
            setAmountError('');
        }

        const amountInCents = parseFloat(amount) * 100;
        const data = {
            donar_name: donorName,
            amount: amountInCents,
        };
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/donationtransaction/paymentInfo/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const responseData = await response.json();
                const clientSecret = responseData.clientSecret;
                navigate('/paymentConfirm', {
                    state: {
                        clientSecret,
                        amount,
                        donorName,
                        purpose,
                    }
                });

            } else {
                setIsLoading(false);
                handleError('Payment creation failed. Please try again')
                console.log('Payment creation failed.');
            }

        }
        catch (error) {
            setIsLoading(false);
            handleError('Error occurred while processing the payment')
            console.error('Error occurred while processing the payment:');
        }
    };


    const handleDonorNameChange = (event) => {
        const donorNameValue = event.target.value;
        setDonorName(donorNameValue);
        if (!donorNameValue) {
            setDonorNameError('Please enter a donor name.');
        } else {
            setDonorNameError('');
        }
    };

    const handleAmountChange = (event) => {
        const amountValue = event.target.value;
        if (!/^\d+(\.\d{1,2})?$/.test(amountValue)) {
            setAmountError('Please enter a valid number.');
        } else if (amountValue <= 0) {
            setAmountError('Please enter a valid amount.');
        } else if (amountValue <= 2) {
            setAmountError('Please enter at least RM2');
        } else {
            setAmountError('');
        }
        setAmount(amountValue);
    };

    return (
        <ThemeProvider theme={theme}>
            {isLoading && (
                <div className="m-loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
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
                <Paper
                    elevation={6}
                    sx={{
                        margin: "auto",
                        padding: "32px",
                        maxWidth: "600px",
                        width: "100%",
                        marginTop: "8%",
                    }}
                >
                    <div style={{ position: 'relative' }}>
                        <Typography variant="h4" gutterBottom>
                            Payment
                        </Typography>
                        <img src={logo} alt="Logo" style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', height: '100px', marginLeft: '0px' }} />
                    </div>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 2, padding: "5%" }}
                        noValidate
                        autoComplete="off"
                    >
                        <h5 style={{ fontWeight: "normal" }}>Donor Name</h5>
                        <TextField
                            required
                            fullWidth
                            id="donor-name"
                            label="name"
                            name="donor-name"
                            autoComplete="donor-name"
                            value={donorName}
                            onChange={handleDonorNameChange}
                            error={Boolean(donorNameError)}
                            helperText={donorNameError}
                            sx={{ mb: 2, width: '100%' }}
                        />
                        <h5 style={{ fontWeight: "normal" }}>Amount</h5>
                        <TextField
                            required
                            fullWidth
                            id="amount"
                            name="amount"
                            label="RM"
                            autoComplete="amount"
                            value={amount}
                            onChange={handleAmountChange}
                            error={Boolean(amountError)}
                            helperText={amountError}
                            sx={{ mb: 2, width: '100%' }}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            variant="contained"
                            sx={{
                                p: 2
                            }}
                            className="authbutton"
                        >
                           {isLoading ? 'Processing...' : 'Make Payment'}  
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>

    );
}

export default PaymentInfo;

