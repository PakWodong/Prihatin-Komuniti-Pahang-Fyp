import React, { useState, useEffect } from 'react';
import '../css/table.css';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faCheck, faTimes, faSort, faTrash } from '@fortawesome/free-solid-svg-icons'
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ParticipantManage() {
    const location = useLocation();
    const [participant, setParticipant] = useState([]);
    const ActivityId = location.state.id;
    const [currentPage, setCurrentPage] = useState(0);
    const [showDescription, setShowDescription] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const itemsPerPage = 4;
    const offset = currentPage * itemsPerPage;
    const [sortKey, setSortKey] = useState("ID");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedDonationRequestId, setSelectedDonationRequestId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [selectedEmail, setSelectedEmail] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const filteredRequests = participant.filter((participant) => participant.status === 'Pending');
    const sortedRequests = filteredRequests.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
            return a[sortKey] < b[sortKey] ? 1 : -1;
        }
    });

    const pageCount = Math.ceil(sortedRequests.length / itemsPerPage);

    const currentItems = sortedRequests.slice(offset, offset + itemsPerPage);

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

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
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

    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };

    useEffect(() => {
        setIsLoading(true);
        const param = parseInt(ActivityId);
        fetch(`${process.env.REACT_APP_API_URL}/donationactivity/ParticipantManage/${param}`)
            .then(response => response.json())
            .then(data => {
                // alert(JSON.stringify(data));
                setParticipant(data);
            })
            .catch(error => {
                handleError('An error occurred while fetching the data');
                console.error(error)
            });
        setIsLoading(false);
    }, [sortKey, sortOrder]);

    const updateStatus = (id, status, email, reason) => {
        setIsLoading(true);
        const param = parseInt(ActivityId);
        fetch(`${process.env.REACT_APP_API_URL}/donationactivity/volunteerParticipant/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, status: status, email: email, reason: reason }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    handleSuccess(data.message)
                }
                else {
                    handleError(data.error)
                }
                fetch(`${process.env.REACT_APP_API_URL}/donationactivity/ParticipantManage/${param}`)
                    .then(response => response.json())
                    .then(data => {
                        setIsLoading(false);
                        setParticipant(data);
                        setCurrentPage(0);
                    })
                    .catch(error => {
                        setIsLoading(false);
                        console.error(error)
                        handleError('An error occurred while fetching the data');
                    });
            }, [sortKey, sortOrder])
            .catch(error => {
                setIsLoading(false);
                handleError('There was a problem updating the donation request status')
                console.error('There was a problem updating the donation request status:', error);
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
                    <h2>Volunteer Participant Page</h2>
                    <div className="Prihatin">
                        | Prihatin Komuniti Pahang
                    </div>
                </div>
                <h3>Volunteer Pending Detail</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name <FontAwesomeIcon icon={faSort} onClick={() => handleSort("name")} /></th>
                            <th>Email <FontAwesomeIcon icon={faSort} onClick={() => handleSort("email")} /></th>
                            <th>Date <FontAwesomeIcon icon={faSort} onClick={() => handleSort("date")} /></th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>More info</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems
                            .filter(participant => participant.status === 'Pending').map((participant, index) => (
                                <tr key={participant.id}>
                                    <td>{++index}</td>
                                    <td>{participant.name}</td>
                                    <td>{participant.email}</td>
                                    <td>{participant.date}</td>
                                    <td>
                                        <button style={{
                                            backgroundColor: '#7e8cd8',
                                            color: '#fff',
                                            padding: '5px 10px',
                                            borderRadius: '6px',
                                            border: 'none'
                                        }}>{participant.status}</button>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <FontAwesomeIcon icon={faExclamationCircle} size="2x" style={{ color: '#3A9BDC' }} onClick={() => toggleDescription(participant.name, participant.email, participant.description)} />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon icon={faCheck} size="2x" style={{ color: 'green', marginRight: '20px' }}
                                            onClick={() => handleConfirmation(participant.id, participant.email, 'Approved')} />
                                        <FontAwesomeIcon icon={faTimes} size="2x" style={{ color: 'red' }}
                                            onClick={() => handleConfirmation(participant.id, participant.email, "Rejected")} />
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
                                <h2 class="m-heading">Volunteer Participant information</h2>
                                <div class="m-form">
                                    <label for="name">Name:</label>
                                    <input id="name" type="text" value={selectedName} readOnly></input>

                                    <label for="email">Email:</label>
                                    <input id="email" type="email" value={selectedEmail} readOnly></input>

                                    <label for="reason">Reason to join Volunteer Activity:</label>
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
                                <h2 class="m-heading">Update Volunteer Participant Status</h2>
                                <div class="m-form">
                                    <p>Are you sure you want to update the volunteer participant status? Once you update the status, you cannot revert back</p>
                                    <label for="name">Reason to Accept/Reject Volunteer Participant</label>
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
                                {participant.filter(participant => participant.status === 'Approved').map((participant) => (
                                    <tr key={participant.id}>
                                        <td>{participant.name}</td>
                                        <td>{participant.email}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <FontAwesomeIcon icon={faExclamationCircle} size="2x" style={{ color: '#3A9BDC' }} onClick={() => toggleDescription(participant.name, participant.email, participant.description)} />
                                        </td>
                                        {/* <td style={{ textAlign: 'center' }}>
                                            <FontAwesomeIcon icon={faTrash} size="2x" onClick={() => updateStatus(participant.id, "Pending")} />
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
                                {participant.filter(participant => participant.status === 'Rejected').map((participant) => (
                                    <tr key={participant.id}>
                                        <td>{participant.name}</td>
                                        <td>{participant.email}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <FontAwesomeIcon icon={faExclamationCircle} size="2x" style={{ color: '#3A9BDC' }} onClick={() => toggleDescription(participant.name, participant.email, participant.description)} />
                                        </td>
                                        {/* <td style={{ textAlign: 'center' }}>
                                            <FontAwesomeIcon icon={faTrash} size="2x" onClick={() => updateStatus(participant.id, "Pending")} />
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
export default ParticipantManage;