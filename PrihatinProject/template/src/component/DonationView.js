import React, { useState, useEffect } from 'react';
import '../css/table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faCheck, faTimes, faSort, faTrash } from '@fortawesome/free-solid-svg-icons'
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DonationView() {
    const [donationRequests, setDonationRequests] = useState([]);
    const [showDescription, setShowDescription] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [selectedEmail, setSelectedEmail] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [selectedDonationRequestId, setSelectedDonationRequestId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const offset = currentPage * itemsPerPage;
    const [reason, setReason] = useState('');
    const [sortKey, setSortKey] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
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

    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };

    const toggleDescription = (name, email, description) => {
        setSelectedName(name);
        setSelectedEmail(email);
        setSelectedDescription(description);
        setShowDescription(true);
    };

    const handleConfirmation = (donationRequestId, email, status) => {
        setSelectedDonationRequestId(donationRequestId);
        setSelectedEmail(email);
        setSelectedStatus(status);
        setConfirmationVisible(true);
    };

    const handleUpdateStatus = () => {
        updateStatus(selectedDonationRequestId, selectedStatus, selectedEmail, reason);
        setReason('')
        setConfirmationVisible(false);
    };

    const handleCancelUpdate = () => {
        setReason('')
        setConfirmationVisible(false);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/donation/request/`);
                const data = await response?.json();
                setDonationRequests(data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(true);
                retryFetchData();
            }
        };
        const retryFetchData = () => {
            setTimeout(fetchData, 3000);
        };
        fetchData();
    }, [sortKey, sortOrder]);


    const updateStatus = async (id, status, email, reason) => {
        try {
            setIsLoading(true);

            const updateResponse = await fetch(`${process.env.REACT_APP_API_URL}/donation/request/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, status: status, email: email, reason: reason }),
            });

            if (!updateResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const updateData = await updateResponse.json();

            if (updateData.success) {
                handleSuccess(updateData.message);
            } else {
                handleError(updateData.error);
            }
            await retryFetchData();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(true);
            console.error(error);
        }
    };

    const retryFetchData = async () => {
        try {
            const fetchResponse = await fetch(`${process.env.REACT_APP_API_URL}/donation/request/`);
            const data = await fetchResponse?.json();
            setDonationRequests(data);
            setCurrentPage(0);
        } catch (error) {
            setIsLoading(true);
            retryFetchData();
            console.error(error);
            //handleError('An error occurred while fetching the donation data');
        }
    };


    const filteredRequests = donationRequests.filter((donationRequest) => donationRequest.status === 'Pending');
    const sortedRequests = filteredRequests.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
            return a[sortKey] < b[sortKey] ? 1 : -1;
        }
    });

    const pageCount = Math.ceil(sortedRequests.length / itemsPerPage);

    const currentItems = sortedRequests.slice(offset, offset + itemsPerPage);


    return ( //return html page to display to user
        <div>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="top">    {/* header page of application */}
                <div className="topInfo">
                    <h2>Donation Requests Page</h2>
                    <div className="Prihatin">
                        | Prihatin Komuniti Pahang
                    </div>
                </div>
                <h3>Donation Request Detail</h3>
                <table>   {/*table to display the donation request  */}
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name <FontAwesomeIcon icon={faSort} onClick={() => handleSort("name")} /></th>  {/* Sort by Name  */}
                            <th>Email <FontAwesomeIcon icon={faSort} onClick={() => handleSort("email")} /></th> {/*Sort by email  */}
                            <th>Date</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>More info</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems //filter the donation request to only display donation request where status is Pending
                            .filter(donationRequest => donationRequest.status === 'Pending').map((donationRequest, index) => (
                                <tr key={donationRequest.id}>
                                    <td>{++index}</td>
                                    <td>{donationRequest.name}</td>
                                    <td>{donationRequest.email}</td>
                                    <td>{formatDate(donationRequest.date)}</td>
                                    <td>
                                        <button style={{
                                            backgroundColor: '#7e8cd8',
                                            color: '#fff',
                                            padding: '5px 10px',
                                            borderRadius: '6px',
                                            border: 'none'
                                        }}>{donationRequest.status}</button>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <FontAwesomeIcon icon={faExclamationCircle} size="2x" style={{ color: '#3A9BDC' }} onClick={() => toggleDescription(donationRequest.name, donationRequest.email, donationRequest.description)} />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            size="2x"
                                            style={{ color: 'green', marginRight: '20px' }}
                                            onClick={() => handleConfirmation(donationRequest.id, donationRequest.email, 'Approved')}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            size="2x"
                                            style={{ color: 'red' }}
                                            onClick={() => handleConfirmation(donationRequest.id, donationRequest.email, 'Rejected')}
                                        />
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

                {showDescription && (
                    <div class="m-overlay">
                        <div class="m">
                            <button class="close-bn" onClick={() => setShowDescription(false)}>X</button>
                            <div class="m-content">
                                <h2 class="m-heading">Donation Request information</h2>
                                <div class="m-form">
                                    <label for="name">Name:</label>
                                    <input id="name" type="text" value={selectedName} readOnly></input>

                                    <label for="email">Email:</label>
                                    <input id="email" type="email" value={selectedEmail} readOnly></input>

                                    <label for="reason">Reason:</label>
                                    <textarea id="reason" class="m-description" value={selectedDescription} readOnly></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {confirmationVisible && (
                    <div className="m-overlay">
                        <div className="m">
                            <button class="close-bn" onClick={handleCancelUpdate}>X</button>
                            <div class="m-content">
                                <h2 class="m-heading">Update Donation Request Status</h2>
                                <div class="m-form">
                                    <p>Are you sure you want to update the donation request status?Once you update the status, you cannot revert back</p>
                                    <label for="name">Reason to Accept/Reject donation request</label>
                                    <textarea id="reason" type="text" value={reason} onChange={handleReasonChange} />
                                    <div className="confirmation-buttons">
                                        <button className="confirm-btn" onClick={handleUpdateStatus}>Proceed</button>
                                        <button className="cancel-btn" onClick={handleCancelUpdate}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex' }}>
                    <h3 style={{ fontWeight: "normal", marginRight: '34vw' }}>Accepted Request</h3>
                    <h3 style={{ fontWeight: "normal" }}>Rejected Request</h3>
                </div>
                <div style={{ display: 'flex', marginBottom: '2%', paddingBottom: '5vh' }}>
                    <div style={{ height: '40vh', width: '45vw', overflow: 'scroll', marginRight: '5vw' }}>
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th style={{ textAlign: 'center' }}>More info</th>
                                    {/* <th>Delete</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {donationRequests.filter(donationRequest => donationRequest.status === 'Approved').map((donationRequest) => (
                                    <tr key={donationRequest.id}>
                                        <td>{donationRequest.name}</td>
                                        <td>{donationRequest.email}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <FontAwesomeIcon icon={faExclamationCircle} size="2x" style={{ color: '#3A9BDC' }} onClick={() => toggleDescription(donationRequest.name, donationRequest.email, donationRequest.description)} />
                                        </td>
                                        {/* <td style={{ textAlign: 'center' }}>
                                            <FontAwesomeIcon icon={faTrash} size="2x" onClick={() => updateStatus(donationRequest.id, "Pending")} />
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ height: '40vh', width: '45vw', overflow: 'scroll' }}>
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th style={{ textAlign: 'center' }}>More info</th>
                                    {/* <th>Delete</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {donationRequests.filter(donationRequest => donationRequest.status === 'Rejected').map((donationRequest) => (
                                    <tr key={donationRequest.id}>
                                        <td>{donationRequest.name}</td>
                                        <td>{donationRequest.email}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <FontAwesomeIcon icon={faExclamationCircle} size="2x" style={{ color: '#3A9BDC' }} onClick={() => toggleDescription(donationRequest.name, donationRequest.email, donationRequest.description)} />
                                        </td>
                                        {/* <td style={{ textAlign: 'center' }}>
                                            <FontAwesomeIcon icon={faTrash} size="2x" onClick={() => updateStatus(donationRequest.id, "Pending")} />
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DonationView;
