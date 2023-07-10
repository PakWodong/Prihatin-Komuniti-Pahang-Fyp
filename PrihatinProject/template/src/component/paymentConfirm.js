import React, { useState } from "react";
import { CardElement, useElements, useStripe, FpxBankElement } from "@stripe/react-stripe-js";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import logo from '../image/th-removebg-preview.png';
import { TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

function PaymentConfirm() {
    const stripe = useStripe();
    const location = useLocation();
    const clientSecret = location.state.clientSecret;
    const amount = location.state.amount;
    const donorName = location.state.donorName;
    const purpose = location.state.purpose;
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
    const navigate = useNavigate();

    const handlePaymentSubmit = async () => { // handle the payment method
        setIsLoading(true); // set loading button so that user cannot click again
        const data = { // set payment data
            donar_name: donorName,
            amount: amount,
            purpose: purpose,
        };
        try {
            if (selectedPaymentMethod === "card") { // if user choose card bank
                const cardElement = elements.getElement(CardElement);

                const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, { //check whether payment successfull
                    payment_method: {
                        card: cardElement,
                    },
                });

                if (error) { // if payment not successfull
                    handleError(error.message); //display error message
                    setTimeout(() => { // send to payment Failed page
                        navigate('/paymentFailed', {
                            state: {
                                donar_name: donorName,
                                amount: amount,
                                paymentMethod: 'card',
                            }
                        });
                    }, 3000);
                } else if (paymentIntent) {  // if payment successfull
                    await fetch(`${process.env.REACT_APP_API_URL}/donationtransaction/payment/`, { // create a new donation transaction
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })
                    handleSuccess("Payment succeeded!");// display payment success message
                    setTimeout(() => {
                        navigate('/paymentSuccessfull', {
                            state: {
                                donar_name: donorName,
                                amount: amount,
                                paymentMethod: 'card',
                            }
                        });
                    }, 3000);
                }
            } else if (selectedPaymentMethod === "fpx") {
                const fpxBankElement = elements.getElement(FpxBankElement);
                await stripe.confirmFpxPayment(clientSecret, {
                    payment_method: {
                        fpx: fpxBankElement,
                    },
                    return_url: `${process.env.REACT_APP_API_URL}/donationtransaction/paymentFpx/?donorName=${donorName}&amount=${amount}&purpose=${purpose}`
                });
            }

        } catch (error) {
            handleError("An error occurred while processing the payment.");
            console.error(error);
        }

        setIsLoading(false);
    };

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
                    <div style={{ marginBottom: "10%", marginTop: "5%" }}>
                        <div style={{ marginBottom: "5%" }}>
                            <button
                                type="button"
                                onClick={() => setSelectedPaymentMethod("card")}
                                style={{
                                    background: selectedPaymentMethod === "card" ? "linear-gradient(90deg, #fa4aa1, #504f8c)" : "#C0C0C0",
                                    color: selectedPaymentMethod === "card" ? "white" : "#000",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "8px 16px",
                                    marginRight: "16px",
                                    cursor: "pointer",
                                }}
                            >
                                Credit or debit card
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedPaymentMethod("fpx")}
                                style={{
                                    background: selectedPaymentMethod === "fpx" ? "linear-gradient(90deg, #fa4aa1, #504f8c)" : "#C0C0C0",
                                    color: selectedPaymentMethod === "fpx" ? "white" : "#000",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "8px 16px",
                                    cursor: "pointer",
                                }}
                            >
                                FPX Online Banking
                            </button>
                        </div>
                        {selectedPaymentMethod === "card" ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <h5 style={{ fontWeight: "normal", marginBottom: "5%" }}>FPX Online Banking</h5>
                                <div id="fpx-bank-element">
                                    <FpxBankElement options={{ accountHolderType: "individual" }} />
                                </div>
                            </>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={!stripe || isLoading}
                        variant="contained"
                        onClick={handlePaymentSubmit}
                        sx={{
                            p: 1
                        }}
                        className="authbutton"
                    >
                        {isLoading ? 'Processing...' : 'Pay'}
                    </Button>
                </Paper>
            </Box>
        </ThemeProvider>

    );
}

export default PaymentConfirm;

