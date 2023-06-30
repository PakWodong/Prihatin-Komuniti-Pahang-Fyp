import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import '../css/main.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const localizer = momentLocalizer(moment);

function Calendar() {
    const [events, setEvents] = useState([]);
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
    
    useEffect(() => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}donationactivity/addEvent/`)
            .then(response => {
                setEvents(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                console.error(error);
                handleError('An error occurred while fetching the data');
            });
    }, []);

    return (
        <div>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="top">
                <div className="topInfo">
                    <h2>Calendar Page</h2>
                    <div className="Prihatin">
                        | Prihatin Komuniti Pahang
                    </div>
                </div>
                <div className="calendar">
                    <BigCalendar
                        localizer={localizer}
                        events={events.map((event) => ({
                            title: event.name,
                            start: moment(`${event.start_date} ${event.time_start}`).toDate(),
                            end: moment(`${event.end_date} ${event.time_end}`).toDate(),
                        }))}
                        startAccessor="start"
                        endAccessor="end"
                    />
                </div>
            </div>
        </div>
    )

}
export default Calendar;