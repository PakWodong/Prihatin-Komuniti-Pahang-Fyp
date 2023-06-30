import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaImage } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const faImageStyle = {
    fontSize: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '250px',
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

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!accessToken) {
      window.location.href = '/login';
      return;
    } else if (isAdmin === 'true') {
      window.location.href = '/admin';
      return;
    } else {
      axios.get(`${process.env.REACT_APP_API_URL}donationactivity/addEvent/`)
        .then(response => {
          setEvents(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          handleError('An error occurred while fetching the data');
        });
    }
  }, []);

  const viewEvent = (event) => {
    navigate('/viewEvent', { state: { event } });
  };

  return (
    <div>
      {loading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="top">
          <div className="topInfo">
            <h2>Home Page</h2>
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
                              onClick={() => viewEvent(event)}
                              className="communitybutton"
                            >
                              Learn More
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
