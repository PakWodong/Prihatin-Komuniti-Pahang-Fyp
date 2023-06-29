import React, { useState, useEffect } from 'react';
import '../css/table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faEdit } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ParticipantView() {
    const [volunteers, setVolunteers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;
    const offset = currentPage * itemsPerPage;
    const [sortKey, setSortKey] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
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
        fetch(`${process.env.REACT_APP_API_URL}donationactivity/volunteerParticipant/`)
            .then(response => response.json())
            .then(data => {
                // alert(JSON.stringify(data));
                setVolunteers(data);
            })
            .catch(error => {
                handleError('An error occurred while fetching the data');
                console.error(error)});
    }, [sortKey, sortOrder]);

    const handleUpdate = (id) => {
        navigate('/participantManage', { state: { id} });
    };

    return (
        <div>
            <div className="top">
                <div className="topInfo">
                    <h2>Volunteer Participant Management Page</h2>
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
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((volunteer, index) => (
                            <tr key={volunteer.id}>
                                <td>{++index}</td>
                                <td>{volunteer.name}</td>
                                <td>{volunteer.num_participants}</td>
                                <td>
                                    <button
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleUpdate(volunteer.id)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} size="2x" />
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
            </div>
        </div>
    );
}
export default ParticipantView;
