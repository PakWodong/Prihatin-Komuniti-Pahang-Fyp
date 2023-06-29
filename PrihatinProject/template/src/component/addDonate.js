import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TextField, MenuItem } from "@mui/material";
import logo from '../image/th-removebg-preview.png';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function DonationForm() {
    const currentDate = new Date().toISOString().split('T')[0];
    const location = useLocation();
    const totalMoney = location.state.totalmoney;
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [donorName, setDonorName] = useState('');
    const [donationType, setDonationType] = useState('donor');
    const [purpose, setPurpose] = useState('education');
    const [amountError, setAmountError] = useState('');
    const [donorNameError, setDonorNameError] = useState('');
    const [dateError, setDateError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleAmountChange = (event) => {
        const amountValue = event.target.value;
        if (!/^\d+(\.\d{1,2})?$/.test(amountValue)) {
            setAmountError('Please enter a valid number.');
        } else if (amountValue <= 0) {
            setAmountError('Please enter a valid amount.');
        } else {
            setAmountError('');
        }
        setAmount(amountValue);
    };

    const formattedDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');


    const handleDateChange = (event) => {
        setDate(event.target.value);
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

    const handleDonationTypeChange = (event) => {
        setDonationType(event.target.value);
    };

    const handlePurposeChange = (event) => {
        setPurpose(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            setAmountError('Please enter a valid amount.');
            return;
        } else {
            setAmountError('');
        }

        if (!date) {
            setDateError('Please enter a date');
            return
        }
        else {
            setDateError('')
        }

        if (!donorName) {
            setDonorNameError('Please enter a donor name.');
            return;
        } else {
            setDonorNameError('');
        }

        if ((donationType == "recipient") && (amount > totalMoney)) {
            handleError('Recepient amount cannot exceed the current total money left');
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}donationtransaction/add/`,
                {
                    amount: parseFloat(amount),
                    donation_date: formattedDate,
                    donor_name: donorName,
                    donation_type: donationType,
                    purpose: purpose,
                },
                { withCredentials: true }
            );
            if (response.data.success) {
                handleSuccess(response.data.message);
                setTimeout(() => {
                    window.location.href = '/donate';
                }, 3000);
            } else {
                setIsLoading(false);
                handleError(response.data.error);
            }
        } catch (error) {
            setIsLoading(false);
            handleError('Something went wrong. Please try again');
        }
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
                        | Prihatin Komuniti Pahang
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
                            <h4>Amount</h4>
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
                                sx={{ mb: 2, width: '80%' }}
                            />
                            <h4>Date</h4>
                            <TextField
                                required
                                fullWidth
                                id="date"
                                name="date"
                                type="date"
                                value={date}
                                inputProps={{
                                    max: currentDate,
                                }}
                                error={Boolean(dateError)}
                                helperText={dateError}
                                onChange={handleDateChange}
                                sx={{ mb: 2, width: '80%' }}
                            />
                            <h4>Donor Name</h4>
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
                                sx={{ mb: 2, width: '80%' }}
                            />
                            <h4>Donation Type</h4>
                            <TextField
                                required
                                fullWidth
                                id="donation-type"
                                select
                                value={donationType}
                                onChange={handleDonationTypeChange}
                                sx={{ mb: 2, width: '80%' }}
                            >
                                <MenuItem value="donor">Donor</MenuItem>
                                <MenuItem value="recipient">Recipient</MenuItem>
                            </TextField>
                            <h4>Donation Purpose</h4>
                            <TextField
                                required
                                fullWidth
                                id="donation-purpose"
                                select
                                value={purpose}
                                onChange={handlePurposeChange}
                                sx={{ mb: 5, width: '80%' }}
                            >
                                <MenuItem value="education">Education Support</MenuItem>
                                <MenuItem value="flood_relief">Flood Relief</MenuItem>
                                <MenuItem value="empowering_live">Empowering Live</MenuItem>
                                <MenuItem value="tuition_program">Tuition Program</MenuItem>
                            </TextField>
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
export default DonationForm;