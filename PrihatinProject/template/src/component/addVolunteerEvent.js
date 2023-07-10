import React, { useState, useRef } from 'react';
import axios from 'axios';
import logo from '../image/th-removebg-preview.png';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import { RiFileUploadLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddVolunteerEvent() {
  const currentDate = new Date().toISOString().split('T')[0];
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState('');
  const [fees, setFees] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [venue, setVenue] = useState('');
  const [images, setImages] = useState([]);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [feesError, setFeesError] = useState('');
  const [timeStartError, setTimeStartError] = useState('');
  const [timeEndError, setTimeEndError] = useState('');
  const [venueError, setVenueError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);
    if (selectedStartDate > endDate) {
      setEndDate(selectedStartDate);
    }
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    if (selectedEndDate >= startDate) {
      setEndDate(selectedEndDate);
    }
  };

  const handleTimeStartChange = (e) => {
    const selectedTimeStart = e.target.value;
    setTimeStart(selectedTimeStart);
    if (selectedTimeStart > timeEnd) {
      setTimeEnd(selectedTimeStart);
    }
  };

  const handleTimeEndChange = (e) => {
    const selectedTimeEnd = e.target.value;
    if (selectedTimeEnd >= timeStart) {
      setTimeEnd(selectedTimeEnd);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      setNameError('Please enter an activity name');
      return;
    } else {
      setNameError('');
    }

    if (!venue) {
      setVenueError('Please enter a venue for the activity');
      return;
    } else {
      setVenueError('');
    }

    if (!/^\d+(\.\d{1,2})?$/.test(fees)) {
      setFeesError('Please enter a valid number.');
      return;
    } else if (fees < 0) {
      setFeesError('Please enter a valid amount.');
      return;
    } else {
      setFeesError('');
    }

    if (!startDate) {
      setStartDateError('Enter a Start Date ');
      return;
    } else {
      setStartDateError('');
    }

    if (!endDate) {
      setEndDateError('Enter an End Date ');
      return;
    } else {
      setEndDateError('');
    }

    if (!timeStart) {
      setTimeStartError('Enter a Start time');
      return;
    } else {
      setTimeStartError('');
    }

    if (!timeEnd) {
      setTimeEndError('Enter an End time');
      return;
    } else {
      setTimeEndError('');
    }

    if (!description) {
      setDescriptionError('Enter a Description');
      return;
    } else {
      setDescriptionError('');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('fees', fees);
    formData.append('time_start', timeStart);
    formData.append('time_end', timeEnd);
    formData.append('venue', venue);
    formData.append('status', 'off');

    images.forEach((image, index) => {
      formData.append(`image_${index + 1}`, image);
    });

    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/donationactivity/addEvent/`, formData);
      console.log(response.data);
      if (response.data.success) {
        handleSuccess(response.data.message);
        setTimeout(() => {
          window.location.href = '/VolunteerEvent';
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
          <h2>Add Volunteer Event</h2>
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
              <h4>Activity Name</h4>
              <TextField
                required
                fullWidth
                id="name"
                name="name"
                label="activity-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={Boolean(nameError)}
                helperText={nameError}
                sx={{ mb: 1, width: '80%' }}
              />
              <h4>Venue</h4>
              <TextField
                required
                fullWidth
                id="venue"
                name="venue"
                label="location"
                value={venue}
                error={Boolean(venueError)}
                helperText={venueError}
                onChange={(e) => setVenue(e.target.value)}
                sx={{ mb: 1, width: '80%' }}
              />
              <h4>Fees</h4>
              <TextField
                required
                fullWidth
                id="fees"
                name="fees"
                label="RM"
                value={fees}
                error={Boolean(feesError)}
                helperText={feesError}
                onChange={(e) => setFees(e.target.value)}
                sx={{ mb: 1, width: '80%' }}
              />

              <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", width: "60%" }}>
                <div>
                  <h4 >Start Date</h4>
                  <TextField
                    required
                    fullWidth
                    id="start-date"
                    name="start-date"
                    type="date"
                    value={startDate}
                    error={Boolean(startDateError)}
                    helperText={startDateError}
                    onChange={handleStartDateChange}
                    inputProps={{
                      min: currentDate,
                    }}
                    sx={{ mb: 1, width: '220%' }}
                  />
                </div>
                <div style={{}}>
                  <h4>End Date</h4>
                  <TextField
                    required
                    fullWidth
                    id="end-date"
                    name="end-date"
                    type="date"
                    value={endDate}
                    error={Boolean(endDateError)}
                    helperText={endDateError}
                    onChange={handleEndDateChange}
                    inputProps={{
                      min: startDate,
                    }}
                    sx={{ mb: 1, width: '220%' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", width: "57%" }}>
                <div>
                  <h4>Time Start</h4>
                  <TextField
                    required
                    fullWidth
                    id="time-start"
                    name="time-start"
                    type="time"
                    error={Boolean(timeStartError)}
                    helperText={timeStartError}
                    value={timeStart}
                    onChange={handleTimeStartChange}
                    sx={{ mb: 1, width: '267%' }}
                  />
                </div>
                <div>
                  <h4>Time End</h4>
                  <TextField
                    required
                    fullWidth
                    id="time-end"
                    name="time-end"
                    type="time"
                    error={Boolean(timeEndError)}
                    helperText={timeEndError}
                    value={timeEnd}
                    onChange={handleTimeEndChange}
                    sx={{ mb: 1, width: '267%' }}
                  />
                </div>
              </div>

              <h4>Description</h4>
              <TextField
                required
                fullWidth
                id="description"
                name="description"
                value={description}
                error={Boolean(descriptionError)}
                helperText={descriptionError}
                multiline
                rows={5}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 7, width: '80%' }}
              />
              <div>
                <div style={{ display: 'flex', marginBottom: '2%' }}>
                  {[...Array(5)].map((_, index) => {
                    const [imagePreview, setImagePreview] = useState(null);
                    const inputRef = useRef(null);

                    const handleImageUpload = () => {
                      inputRef.current.click();
                    };

                    const handleFileChange = (event) => {
                      const file = event.target.files[0];

                      setImages((prevImages) => {
                        const updatedImages = [...prevImages];
                        updatedImages[index] = file;
                        return updatedImages;
                      });
                      const reader = new FileReader();
                      reader.onload = () => {
                        setImagePreview(reader.result);
                      };
                      reader.readAsDataURL(file);
                    };

                    return (
                      <div
                        key={index}
                        style={{
                          width: '15%',
                          height: '200px',
                          border: '1px solid #ccc',
                          marginRight: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={handleImageUpload}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          ref={inputRef}
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        {imagePreview ? (
                          <img src={imagePreview} alt="Uploaded" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                        ) : (
                          <RiFileUploadLine size={24} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
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
  );

}

export default AddVolunteerEvent;
