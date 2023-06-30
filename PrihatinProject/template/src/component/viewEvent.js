import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ViewEvent() {
    const navigate = useNavigate();
    const location = useLocation();
    const volunteer = location.state.event;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [fees, setFees] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [venue, setVenue] = useState('');
    const [images, setImages] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Access the volunteer object and set the form fields accordingly
        {
            //get the user ID from local storage
            setIsLoading(true);
            const param = parseInt(localStorage.getItem('user_id'));
            //get the volunteer activity for registered event
            axios.get(`${process.env.REACT_APP_API_URL}donationactivity/VolunteerRegistered/${param}`)
                .then(response => {
                    const Registered = response.data.find(obj => obj.id === volunteer.id);
                    if (Registered) {
                        setIsRegistered(true);
                        setEvents(Registered)
                    }
                })
                .catch(error => {
                    console.error(error);
                    handleError('An error occurred while fetching the data');
                });
            setIsLoading(false);
        }
        setName(volunteer.name);
        setDescription(volunteer.description);
        setStartDate(volunteer.start_date);
        setEndDate(volunteer.end_date);
        setFees(volunteer.fees);
        setTimeStart(volunteer.time_start);
        setVenue(volunteer.venue);
        setImages(volunteer.image_urls);
    }, [volunteer]);

    const RegisterEvent = (volunteerid) => {
        navigate('/registerVolunteer', { state: { volunteerid } });
    };

    return (
        <div>
            <div className="top">
                <div className="topInfo">
                    <h2>{volunteer.name}</h2>
                    <div className="Prihatin">
                        | {localStorage.getItem('username')}
                    </div>
                </div>
                <div className="infoContainer">
                    <div className="infoContainer1">
                        <h3 style={{ marginBottom: "3%" }}>{name}</h3>
                        <div style={{ float: "right", marginLeft: "5%", marginBottom: "1%" }}>
                            {images.length > 0 && (
                                <img
                                    src={images[0]}
                                    style={{ float: "right", height: "18em", width: "18em", border: "1px solid #ccc", boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
                                />
                            )}
                            {images.length > 1 && (
                                <div>
                                    <div>
                                        {images.slice(1).map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                style={{ height: "4em", width: "4em", marginTop: "1em", marginRight: "1em", cursor: "pointer", border: "1px solid #ccc", boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
                                                onClick={() => {
                                                    const newImages = [image, ...images.slice(1, index + 1), images[0], ...images.slice(index + 2)];
                                                    setImages(newImages);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {description.split('\n').map((paragraph, index) => (
                            <p key={index} style={{ textIndent: "2em", marginBottom: "1em", textAlign: "justify" }}>{paragraph}</p>
                        ))}
                    </div>
                    <div className="infoContainer2">
                        <div className="titleBox">
                            <h3>Program Detail</h3>
                        </div>
                        <hr />
                        <div className="info">
                            <h4 >Start Date</h4>
                            <h4 style={{ marginLeft: "auto" }}>{new Date(startDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</h4>
                        </div>
                        <hr />
                        <div className="info">
                            <h4 >End Date</h4>
                            <h4 style={{ marginLeft: "auto" }}>{new Date(endDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</h4>
                        </div>
                        <hr />
                        <div className="info">
                            <h4>Fees</h4>
                            <h4 style={{ marginLeft: "auto" }}>RM{fees}</h4>
                        </div>
                        <hr />
                        <div className="info">
                            <h4 >Time</h4>
                            <h4 style={{ marginLeft: "auto" }}>{new Date(`1970-01-01T${timeStart}`).toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</h4>
                        </div>
                        <hr />
                        <div className="info">
                            <h4 >Venue</h4>
                            <h4 style={{ marginLeft: "auto" }}>{venue}</h4>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "3%" }}>

                    {!isRegistered ? (<button
                        onClick={() => RegisterEvent(volunteer.id)}
                        className="btn btn-primary"
                        style={{
                            width: "40%",
                            background: "linear-gradient(90deg, #fa4aa1, #504f8c)",
                            color: "white",
                        }}
                    >
                        <h4>Register as volunteer</h4>
                    </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            style={{
                                width: "40%",
                                background: "linear-gradient(90deg, #fa4aa1, #504f8c)",
                                color: "white",
                            }}
                        >
                            <h4>{events.participant_status}</h4>
                        </button>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default ViewEvent;
