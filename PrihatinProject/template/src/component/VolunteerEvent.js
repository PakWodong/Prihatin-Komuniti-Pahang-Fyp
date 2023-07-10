import React, { useState, useEffect } from 'react';
import '../css/table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VolunteerView() {
    const [volunteers, setVolunteers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;
    const offset = currentPage * itemsPerPage;
    const [sortKey, setSortKey] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedDonationRequestId, setSelectedDonationRequestId] = useState(null);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const sortedRequests = volunteers.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
            return a[sortKey] < b[sortKey] ? 1 : -1;
        }
    });

    const pageCount = Math.ceil(sortedRequests.length / itemsPerPage);

    const currentItems = sortedRequests.slice(offset, offset + itemsPerPage);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/donationactivity/addEvent/`);
                const data = await response.json();
                setVolunteers(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                handleError('An error occurred while fetching the data');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [sortKey, sortOrder]);


    const handleUpdate = (volunteer) => {
        navigate('/updateVolunteerEvent', { state: { volunteer } });
    };

    const handleDelete = async (id) => {
        try {
            setIsLoading(true);

            const deleteResponse = await fetch(`${process.env.REACT_APP_API_URL}/donationactivity/addEvent/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                }),
            });

            if (!deleteResponse.ok) {
                throw new Error(deleteResponse.statusText);
            }

            const deleteData = await deleteResponse.json();

            if (deleteData.success) {
                handleSuccess(deleteData.message);
            } else {
                handleError(deleteData.error);
            }

            const fetchResponse = await fetch(`${process.env.REACT_APP_API_URL}/donationactivity/addEvent/`);
            const data = await fetchResponse.json();

            setIsLoading(false);
            setVolunteers(data);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            handleError('An error occurred while deleting the volunteer event');
        }
    };


    const addVolunteerEvent = () => {
        navigate('/addEvent');
    }

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

    const handleDeleteConfirmation = (donationRequestId, donationAmount, status) => {
        setSelectedDonationRequestId(donationRequestId);
        setConfirmationVisible(true);
    };

    const handleCancelUpdate = () => {
        setConfirmationVisible(false);
    };

    const handleUpdateStatus = () => {
        handleDelete(selectedDonationRequestId);
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
                    <h2>Volunteer Event Management Page</h2>
                    <div className="Prihatin">
                        | Prihatin Komuniti Pahang
                    </div>
                </div>

                <h3>Volunteer Event Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Volunteer Event Name <FontAwesomeIcon icon={faSort} onClick={() => handleSort("name")} /></th>
                            <th>Volunteer Participation <FontAwesomeIcon icon={faSort} onClick={() => handleSort("email")} /></th>
                            <th>Start Date <FontAwesomeIcon icon={faSort} onClick={() => handleSort("start_date")} /></th>
                            <th>End Date <FontAwesomeIcon icon={faSort} onClick={() => handleSort("end_date")} /></th>
                            <th>Status <FontAwesomeIcon icon={faSort} onClick={() => handleSort("status")} /></th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((volunteer, index) => (
                            <tr key={volunteer.id}>
                                <td>{++index}</td>
                                <td>{volunteer.name}</td>
                                <td>{volunteer.num_participants}</td>
                                <td>{volunteer.start_date}</td>
                                <td>{volunteer.end_date}</td>
                                <td>
                                    <button style={{
                                        backgroundColor: volunteer.status === 'on' ? '#3A5311' : '#FF0000',
                                        color: '#fff',
                                        padding: '5px 10px',
                                        borderRadius: '10px',
                                        border: 'none'
                                    }}>{volunteer.status}</button>
                                </td>
                                <td>
                                    <button
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleUpdate(volunteer)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} size="2x" />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleDeleteConfirmation(volunteer.id)}>
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
                                <h2 class="m-heading">Delete Volunteer Event</h2>
                                <div class="m-form">
                                    <p>Are you sure you want to delete the volunteer event? Once you delete the event, you cannot revert back</p>
                                    <div className="confirmation-buttons">
                                        <button className="confirm-btn" onClick={handleUpdateStatus}>Delete</button>
                                        <button className="cancel-btn" onClick={handleCancelUpdate}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <button onClick={() => addVolunteerEvent()} className='buttonStyle'>
                    Add Volunteer Event
                </button>
            </div>
        </div>
    );
}
export default VolunteerView;
