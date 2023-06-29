import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './component/navigation';
import { Logout } from './component/logout';
import LoginPage from './component/loginpage';
import SignUpPage from './component/signup';
import Home from './component/home';
import Admin from './component/admin';
import ForgotPasswordForm from './component/forgot_password';
import ResetPassword from './component/reset_password';
import DonationRequest from './component/DonationRequest';
import DonationView from './component/DonationView';
import DonationForm from './component/addDonate';
import DonateView from './component/Donate';
import AddVolunteerEvent from './component/addVolunteerEvent';
import VolunteerView from './component/VolunteerEvent';
import UpdateVolunteerEvent from './component/updateVolunteerEvent';
import ViewEvent from './component/viewEvent';
import RegisterVolunteer from './component/registerVolunteer';
import RegisteredEvent from './component/registeredEvent';
import ParticipantView from './component/participantView';
import ParticipantManage from './component/ParticipantManage';
import PaymentForm from './component/payment';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Calendar from './component/calender';
import PaymentInfo from './component/paymentInfo';
import PaymentConfirm from './component/paymentConfirm';
import PaymentSuccessfull from './component/paymentsuccesful';
import PaymentFailed from './component/paymentFailed';

function App() {
  const stripePromise = loadStripe("pk_test_51NBuv7E3FORUG47UtxG0clh2I7ZagmkOdMDFTzf9e0sjSEMZA44OQPJllBgP6S1en6OEv1mOibfDX6XG5uHjNJrC00F6XKQqTX");
  return <BrowserRouter>
    <Navigation></Navigation>
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<Home />} />          {/*home page of the application for community*/}
        <Route path="/logout" element={<Logout />} />  {/*logout handling for the frontend*/}
        <Route path="/login" element={<LoginPage />} /> {/*login page for the frontend*/}
        <Route path="/signup" element={<SignUpPage />} /> {/*Community sign up page for the frontend*/}
        <Route path="/admin" element={<Admin />} />  {/*home page of the application for admin*/}
        <Route path="/forgot" element={<ForgotPasswordForm />} /> {/*forgot password page to send password reset link in email*/}
        <Route path="/reset/:email" element={<ResetPassword />} /> {/*reset password page when user click link in email*/}
        <Route path="/DonationRequest" element={<DonationRequest />} /> {/*request page for community to request donation*/}
        <Route path="/DonationView" element={<DonationView />} /> {/*Donation request view page for staff to see*/}
        <Route path="/addDonate" element={<DonationForm />} /> {/*Add New Donation transaction for the staff*/}
        <Route path="/Donate" element={<DonateView />} />  {/*Donation transaction view page for staff to see and delete*/}
        <Route path="/paymentConfirm"element={<PaymentConfirm/>}/> {/*Payment page for user to select FPX or card bank*/}
        <Route path="/paymentInfo"element={<PaymentInfo/>}/> {/*Payment Information page for user*/}
        <Route path="/paymentSuccessfull"element={<PaymentSuccessfull/>}/> {/*Payment Successfull page for user*/}
        <Route path="/paymentFailed"element={<PaymentFailed/>}/> {/*Payment Failed page for user*/}
        <Route path="/addEvent" element={<AddVolunteerEvent />} />{/*Add New Volunteer activity for staff*/}
        <Route path="/VolunteerEvent" element={<VolunteerView />} /> {/*View Volunteer activity for staff*/}
        <Route path="/UpdateVolunteerEvent" element={<UpdateVolunteerEvent />} />{/*Update Volunteer activity for staff*/}
        <Route path="/viewEvent" element={<ViewEvent />} /> {/*View Volunteer activity for community*/}
        <Route path="/registerVolunteer" element={<RegisterVolunteer />} /> {/*Register Volunteer activity for community*/}
        <Route path="/registeredEvent" element={<RegisteredEvent />} /> {/*View Registered Volunteer activity for community*/}
        <Route path="/participantView" element={<ParticipantView />} /> {/*View participant for volunteer activity*/}
        <Route path="/participantManage" element={<ParticipantManage />} />{/*Manage participant for volunteer activity*/}
        <Route path="/calendar"element={<Calendar/>}/>{/*View volunteer activity through calendar for staff*/}
        <Route path="/payment" element={<PaymentForm />} />
      </Routes>
    </Elements>
  </BrowserRouter>;
}
export default App;