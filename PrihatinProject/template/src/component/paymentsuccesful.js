import React, { useState, useEffect } from "react";
import logo from '../image/th-removebg-preview.png';
import "../css/receipt.css";
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';

function PaymentSuccessful() {
    const navigate = useNavigate();
    const location = useLocation();
    const paymentMethod = location.state?.paymentMethod;
    const [donorName, setDonorName] = useState('');
    const [amount, setAmount] = useState('');
    const queryParams = new URLSearchParams(location.search);

    const handleRequestClick = () => {
        navigate('/login');
    };

    useEffect(() => {
        if (paymentMethod === 'card') {
            setDonorName(location.state?.donar_name);
            setAmount(location.state?.amount);
        } else {
            console.log(queryParams.get('donorName'))
            setDonorName(queryParams.get('donorName'));
            setAmount(queryParams.get('amount'));
        }
    })

    return (
        <div>
            <div className="receipt-container">
                <img src={logo} alt="Prihatin Logo" className="formlogo" />
                <h1>Payment Successful</h1>
                <div className="receipt-details">
                    <div className="receipt-field">
                        <span className="field-label">Name:</span>
                        <span className="field-value">{donorName}</span>
                    </div>
                    <div className="receipt-field" style={{ marginBottom: "8%" }}>
                        <span className="field-label">Amount:</span>
                        <span className="field-value">RM {amount}</span>
                    </div>
                    <Button
                        variant="contained"
                        onClick={handleRequestClick}
                        className="authbutton">
                        Home</Button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccessful;
