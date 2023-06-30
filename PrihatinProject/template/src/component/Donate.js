import React, { useState, useEffect } from 'react';
import '../css/table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faTrash } from '@fortawesome/free-solid-svg-icons'
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DonateView() {
    const [donateRequest, setDonateRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const offset = currentPage * itemsPerPage;
    const [sortKey, setSortKey] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [totalMoney, setTotalMoney] = useState(0);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [donorMoney, setNewDonor] = useState(0);
    const [recepientMoney, setNewRecepient] = useState(0);
    const [selectedDonationRequestId, setSelectedDonationRequestId] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
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

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const sortedRequests = donateRequest.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
            return a[sortKey] < b[sortKey] ? 1 : -1;
        }
    });

    const pageCount = Math.ceil(sortedRequests.length / itemsPerPage);

    const currentItems = sortedRequests.slice(offset, offset + itemsPerPage);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}donationtransaction/add/`)
            .then(response => response.json())
            .then(data => {
                let all = 0;
                let donor = 0;
                let recepient = 0;
                setDonateRequests(data)
                data.forEach(request => {
                    if (request.donation_type === 'donor') {
                        donor = donor + parseFloat(request.amount);
                    } else if (request.donation_type === 'recipient') {
                        recepient = recepient + parseFloat(request.amount);
                    }
                });
                all = donor - recepient;
                setNewDonor(donor);
                setTotalMoney(all);
                setNewRecepient(recepient);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                console.error(error);
                handleError('An error occurred while fetching the data');
            });
    }, [sortKey, sortOrder]);

    const handleDelete = (id) => {
        if ((selectedStatus == 'donor') && ((parseFloat(donorMoney) - parseFloat(selectedAmount)) < parseFloat(recepientMoney))) {
            handleError('Cannot delete the donation transaction. Money received cannot exceed money spend.');
            return;
        }
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}donationtransaction/add/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    handleSuccess(data.message);
                }
                else {
                    handleError(data.error);
                }
                console.log('Donation request status updated successfully:', data);
                fetch(`${process.env.REACT_APP_API_URL}donationtransaction/add/`)
                    .then(response => response.json())
                    .then(data => {
                        setIsLoading(false);
                        setDonateRequests(data);
                        let all = 0;
                        let donor = 0;
                        let recepient = 0;
                        data.forEach(request => {
                            if (request.donation_type == 'donor') {
                                donor = donor + parseFloat(request.amount);
                            } else if (request.donation_type == 'recipient') {
                                recepient = recepient + parseFloat(request.amount);
                            }
                        });
                        all = donor - recepient;
                        setNewDonor(donor);
                        setTotalMoney(all);
                        setNewRecepient(recepient);
                        setCurrentPage(0);
                    })
                    .catch(error => {
                        setIsLoading(false);
                        console.error(error);
                        handleError('An error occurred while fetching the data');
                    });
            })
            .catch(error => {
                setIsLoading(false);
                console.error(error);
                handleError('An error occurred while deleting the donation transaction');
            });
    }

    const addDonate = (totalmoney) => {
        navigate('/addDonate', { state: { totalmoney } });
    };

    const handleDeleteConfirmation = (donationRequestId, donationAmount, status) => {
        setSelectedDonationRequestId(donationRequestId);
        setSelectedAmount(donationAmount);
        setSelectedStatus(status);
        setConfirmationVisible(true);
    };

    const handleUpdateStatus = () => {
        handleDelete(selectedDonationRequestId);
        setConfirmationVisible(false);
    };

    const handleCancelUpdate = () => {
        setConfirmationVisible(false);
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
                    <h2>Donation Management Page</h2>
                    <div className="Prihatin">
                        | Prihatin Komuniti Pahang
                    </div>
                </div>
                <div className="container">
                    <div className="box">
                        <h3>Total Money Left</h3>
                        <p>RM {totalMoney.toFixed(2)}</p>
                    </div>
                    <div className="box">
                        <h3>Money Received</h3>
                        <p>RM {donorMoney.toFixed(2)}</p>
                    </div>
                    <div className="box">
                        <h3>Money Spend</h3>
                        <p>RM {recepientMoney.toFixed(2)}</p>
                    </div>
                </div>

                <h3>Transaction Detail</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Donor Name <FontAwesomeIcon icon={faSort} onClick={() => handleSort("donor_name")} /></th>
                            <th>Date <FontAwesomeIcon icon={faSort} onClick={() => handleSort("donation_date")} /></th>
                            <th>Purpose<FontAwesomeIcon icon={faSort} onClick={() => handleSort("purpose")} /></th>
                            <th>Type<FontAwesomeIcon icon={faSort} onClick={() => handleSort("donation_type")} /></th>
                            {/* <th>Amount <FontAwesomeIcon icon={faSort} onClick={() => handleSort("amount")} /></th> */}
                            <th>Amount</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems
                            .map((donateRequest, index) => (
                                <tr key={donateRequest.id}>
                                    <td>{++index}</td>
                                    <td>{donateRequest.donor_name}</td>
                                    <td>{formatDate(donateRequest.donation_date)}</td>
                                    <td>{donateRequest.purpose}</td>
                                    <td>
                                        <button
                                            className={`donation-type-button ${donateRequest.donation_type === 'donor' ? 'donor' : 'recipient'}`}
                                        >
                                            {donateRequest.donation_type}
                                        </button>
                                    </td>

                                    <td>RM {donateRequest.amount}</td>
                                    <td>
                                        <button style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }} onClick={() => handleDeleteConfirmation(donateRequest.id, donateRequest.amount, donateRequest.donation_type)}>
                                            <FontAwesomeIcon icon={faTrash} size="2x" />
                                        </button>
                                    </td>

                                </tr>
                            ))}
                    </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ReactPaginate
                        pageCount={pageCount}
                        onPageChange={({ selected }) => setCurrentPage(selected)}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                        pageClassName={'page-item'}
                        previousClassName={'page-item previous'}
                        nextClassName={'page-item next'}
                        pageLinkClassName={'page-link'}
                        previousLinkClassName={'page-link'}
                        nextLinkClassName={'page-link'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                    />
                </div>
                {confirmationVisible && (
                    <div className="m-overlay">
                        <div className="m">
                            <button class="close-bn" onClick={handleCancelUpdate}>X</button>
                            <div class="m-content">
                                <h2 class="m-heading">Delete Donation Transaction</h2>
                                <div class="m-form">
                                    <p>Are you sure you want to delete the donation transaction? Once you delete the transaction, you cannot revert back</p>
                                    <div className="confirmation-buttons">
                                        <button className="confirm-btn" onClick={handleUpdateStatus}>Delete</button>
                                        <button className="cancel-btn" onClick={handleCancelUpdate}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <button onClick={() => addDonate(totalMoney)} className='buttonStyle'>
                    Insert New Transaction
                </button>
            </div>
        </div>
    );
}

export default DonateView;
