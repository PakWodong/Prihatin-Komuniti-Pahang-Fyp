import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import logo from '../image/th-removebg-preview.png';
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';

const theme = createTheme();

function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [donorName, setDonorName] = useState('');
    const [donorNameError, setDonorNameError] = useState('');
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
        } else {
            setAmountError('');
        }

        setIsLoading(true);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        });

        setIsLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setError(null);
            const amountInCents = parseFloat(amount) * 100;
            const data = {
                paymentMethodId: paymentMethod.id,
                donar_name: donorName,
                amount: amountInCents,
            };
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/donationtransaction/payment/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    // Payment was processed successfully
                    const responseData = await response.json();
                    const message = responseData.message;
                    console.log('Payment processed successfully.');
                    setSuccessMessage(message);
                } else {
                    // Payment processing failed
                    console.log('Payment processing failed.');
                    setErrorMessage("Payment processing failed");
                }
            } catch (error) {
                console.error('Error occurred while processing the payment:', error);
            }
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
                        <div style={{ marginBottom: "10%", marginTop: "5%" }}>
                            <h5 style={{ fontWeight: "normal" }}>Credit or debit card</h5>
                            <label htmlFor="card-element"></label>
                            <CardElement
                                id="card-element"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            color: "#424770",
                                            "::placeholder": {
                                                color: "#aab7c4",
                                            },
                                        },
                                        invalid: {
                                            color: "#9e2146",
                                        },
                                    },
                                }}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!stripe || isLoading}
                            variant="contained"
                            sx={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '16px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            {isLoading ? 'Processing...' : 'Pay'}
                        </Button>
                        {error && <div style={{ color: "red", marginTop: "16px", textAlign: "center" }}>{error}</div>}
                        {errorMessage && <div style={{ color: "red", marginTop: "16px", textAlign: "center" }}>{errorMessage}</div>}
                        {successMessage && <div style={{ color: "green", marginTop: "16px", textAlign: "center" }}>{successMessage}</div>}
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>

    );
}

export default PaymentForm;

