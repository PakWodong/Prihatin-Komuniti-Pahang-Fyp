import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from 'react-bootstrap';
import { FaImage } from "react-icons/fa";

function RegisteredEvent() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const faImageStyle = {
    fontSize: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '250px',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const param = parseInt(localStorage.getItem('user_id'));
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/donationactivity/VolunteerRegistered/${param}`);
        setEvents(response?.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(true);
        retryFetchData();
        //handleError('An error occurred while fetching the data');
      }
    };
    const retryFetchData = () => {
      setTimeout(fetchData, 3000);
    };
    fetchData();
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
          <h2>Registered Event</h2>
          <div className="Prihatin">
            | {localStorage.getItem('username')}
          </div>
        </div>
        <div className="container-fluid">
          {Array(Math.ceil(events.length / 4))
            .fill()
            .map((_, rowIndex) => (
              <div className="row" key={rowIndex}>
                {events.filter((event) => event.status === "on")
                  .sort((a, b) => new Date(b.start_date) - new Date(a.start_date)).slice(rowIndex * 4, rowIndex * 4 + 4).map((event) => (
                    <div key={event.id} className="col-md-3 mb-5">
                      <div className="card">
                        {event.image_urls && event.image_urls.length > 1 ? (
                          <Carousel>
                            {event.image_urls.map((imageUrl, index) => (
                              <Carousel.Item key={index}>
                                <img src={imageUrl} className="card-img-top" alt={event.title} />
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        ) : event.image_urls.length === 1 ? (
                          <img src={event.image_urls[0]} className="card-img-top" alt={event.title} />
                        ) : (
                          <div style={faImageStyle}>
                            <FaImage />
                          </div>
                        )}
                        <div className="card-body">
                          <h3 className="card-title">{event.name}</h3>
                          <p className="card-text">
                            {new Date(event.start_date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })} -{" "}
                            {new Date(event.end_date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                          <button
                            className="communitybutton"
                          >
                            {event.participant_status}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default RegisteredEvent;
