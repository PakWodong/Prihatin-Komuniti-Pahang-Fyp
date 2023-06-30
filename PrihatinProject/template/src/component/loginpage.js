import React, { useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField } from "@mui/material";
import logo from '../image/th-removebg-preview.png';
import EmpoweringLive from '../image/Empowering Live.jpg';
import EducationSupport from "../image/Back To School.jpg";
import FloodRelief from "../image/Flood Relief.jpg";
import Tuition from "../image/Tuition.jpg";
import bg from "../image/bg.jpg";
import request from "../image/request.jpg";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3
};
function LoginPage() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleemailChange = (event) => {
    setemail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleDonateClick = (event) => {
    navigate('/paymentInfo', { state: { event } });
  };

  const handleRequestClick = () => {
    navigate('/DonationRequest');
  };

  const handleSubmit = (event) => {  // to handle submit form when user login into the application
    event.preventDefault();
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}login/`, { // send data to the django backend for authentication method
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({  //Json object that will send to backend
        email: email,
        password: password
      })
    })
      .then(response => response.json())  //send the Json Response from backend
      .then(data => {
        if ('access' in data) {   //set the data from the backend into the local storage
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          localStorage.setItem('isAdmin', data.isAdmin);
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('username', data.username);
          localStorage.setItem('email', data.email);
          if (data.isAdmin) { //send user to admin page if user is staff
            window.location.href = '/admin';
          } else {  //send user to community page if user is community
            window.location.href = '/';
          }
        } else {
          setIsLoading(false);
          { handleLoginError(data.error) } // handle error from backend if email or password does not exist in system
        }
      })
      .catch(error => {
        setIsLoading(false);
        handleLoginError('An error occured while login. Please try again') //handle error if cannot connect to the backend
        console.error(error);
      });
  };

  const handleLoginError = (error) => {
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

  return (
    <ThemeProvider theme={theme}>
      {isLoading && (
                <div className="m-loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${bg})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            justifyContent: 'space-between'
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={logo} alt="Logo" className='formlogo' />
            <Typography component="h1" variant="h5">
              Prihatin Komuniti Pahang
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="email"
                name="email"
                value={email}
                autoComplete="email"
                style={{ color: 'white' }}
                onChange={handleemailChange}
                autoFocus />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange} />
              <Button
                className="authbutton"
                disabled={isLoading}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? 'Processing...' : 'Sign In'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/forgot" variant="body2" style={{ textDecoration: 'none' }} className="link">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  Don't have an account?
                  <Link href="/signup" variant="body2" style={{ textDecoration: 'none' }} className="link">
                    {" Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, height: '0%' }} />
          <Box sx={{ mt: 'auto', mb: 1 }}>
          </Box>
        </Grid>
      </Grid>
      <div className="request">
        <div className="row">
          <div className="col-md-7">
            <div>
              <h2>If you are in need of assistance and require support during challenging times, we are here for you.</h2>
              <br />
              <p>We understand that life can present unexpected hardships, and we believe in the power of community and helping one another. If you find yourself in a difficult situation and require financial or other forms of aid, we encourage you to reach out to us. Our dedicated team at Prihatin Komuniti Pahang is committed to providing support to individuals and families facing adversity.</p>
              <p>To request for assistance, please click on the button below and fill out the donation request form. We kindly ask you to provide detailed information about your situation and the specific type of help you require. Our team will review your request with utmost care and confidentiality. We strive to assist as many individuals as possible, considering the available resources and the urgency of each case.</p>
              <p>At Prihatin Komuniti Pahang, we believe in fostering a sense of compassion and solidarity within our community. We aim to uplift those in need and provide them with the necessary support to overcome their challenges. We understand that asking for help can be difficult, but please know that we are here to listen, understand, and provide assistance wherever possible.</p>
              <p>Together, let's navigate through these tough times and build a stronger, more caring community. Your request for help is important to us, and we will do our best to offer the support you need. Remember, you are not alone, and we are here to lend a helping hand.</p>
            </div>
            <br />
            <button
              onClick={handleRequestClick}
              className="communitybutton">
              Request Donation</button>
          </div>
          <div className="col-md-3 image-40">
            <img src={request} alt="Image" style={{ width: "150%", height: "auto" }} />
          </div>
        </div>
      </div>
      <div className="donateType" >
        <Slider {...settings}>
          <div className="col-md-3 mb-5 p-3">
            <div className="card">
              <img src={EducationSupport} className="card-img-top" alt="Logo" />
              <div className="card-body">
                <h3 className="card-title">Education Support</h3>
                <p className="card-text">Help us to provide essential school supplies and clothing to support students' education and well-being around Kuantan, Pahang</p>
                <button onClick={() => handleDonateClick("education")}
                  className="communitybutton">
                  Donate Now</button>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-5 p-3">
            <div className="card">
              <img src={FloodRelief} className="card-img-top" alt="Logo" />
              <div className="card-body">
                <h3 className="card-title">Flood relief</h3>
                <p className="card-text">Aiding Those in Need: Providing Essential and Urgent Assistance for Flood-Stricken Communities around Kuantan, Pahang </p>
                <button
                  onClick={() => handleDonateClick("flood_relief")}
                  className="communitybutton">
                  Donate Now</button>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-5 p-3">
            <div className="card">
              <img src={EmpoweringLive} className="card-img-top" alt="Logo" />
              <div className="card-body">
                <h3 className="card-title">Empowering Live</h3>
                <p className="card-text">Join us in our mission to uplift disadvantaged communities and provide essential support to those in need</p>
                <button
                  onClick={() => handleDonateClick("empowering_live")}
                  className="communitybutton">
                  Donate Now</button>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-5 p-3">
            <div className="card">
              <img src={Tuition} className="card-img-top" alt="Logo" />
              <div className="card-body">
                <h3 className="card-title">Tuition Program</h3>
                <p className="card-text">Make a difference in the lives of underprivileged students in Kuantan, Pahang by supporting tuition-free programs</p>
                <button
                  onClick={() => handleDonateClick("tuition_program")}
                  className="communitybutton">
                  Donate Now</button>
              </div>
            </div>
          </div>
        </Slider>
      </div>
      <footer>
        <div class="footer-content">
          <div class="footer-column">
            <h4>About Us</h4>
            <p>Prihatin Komuniti Pahang is a community-based organization located in the state of Pahang, Malaysia. The organization focuses on various social initiatives aimed at addressing key issues such as poverty, education, healthcare, and community development.</p>
          </div>
          <div class="footer-column">
            <h4>Services</h4>
            <ul>
              <li>Education Support</li>
              <li>Healthcare Assistance</li>
              <li>Community Development Programs</li>
              <li>Poverty Alleviation</li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Contact Us</h4>
            <p>B-9766 Tingkat Satu JALAN HAJI AHMAD 25300 KUANTAN PAHANG , Kuantan, Malaysia</p>
            <p>Email: prihatinpahang@gmail.com</p>
            <p>Phone: 09-514 1766</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2023 Prihatin Komuniti Pahang. All rights reserved.</p>
        </div>
      </footer>


    </ThemeProvider>
  );
}

export default LoginPage;