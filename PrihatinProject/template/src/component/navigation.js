import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { FaRegUser } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import '../css/Sidebar.css';
import logo from '../image/th-removebg-preview.png';
import { FaCalendar,FaDonate, FaTasks, FaUserFriends } from 'react-icons/fa';
import {GiReceiveMoney } from 'react-icons/gi';


export function Navigation() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken !== null) {
      setIsAuth(true);
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(isAdmin);
    }
  }, []);

  return (
    <>
      {isAuth && (
        <div className="sidebar">
          <div className="sidebar-header">
            <img src={logo} alt="Prihatin Logo" />
          </div>
          <ul className="list-unstyled">
            {isAdmin && (
              <><li>
                <Link to="/admin">
                  <span><FiHome /></span> Overview
                </Link>
              </li>
              <li>
                  <Link to="/Calendar">
                    <span><FaCalendar /></span> Reminder
                  </Link>
                </li>
              <li>
                  <Link to="/Donate">
                    <span><GiReceiveMoney  /></span> Donation Page
                  </Link>
                </li>
                <li>
                  <Link to="/DonationView">
                    <span><FaDonate /></span> Donation Request Page
                  </Link>
                </li>
                <li>
                  <Link to="/VolunteerEvent">
                    <span><FaTasks /></span> Volunteer event
                  </Link>
                </li>
                <li>
                  <Link to="/participantView">
                    <span><FaUserFriends /></span> Volunteer Participant
                  </Link>
                </li>
                </>
            )}
            {!isAdmin && (
              <><li>
                <Link to="/">
                  <span><FiHome /></span> Home Page
                </Link>
              </li>
              <li>
              <Link to="/registeredEvent">
                <span><FaTasks /></span> Registered Volunteer Event
              </Link>
            </li><li>
                  <Link to="/user">
                    <span><FaRegUser /></span> User Profile
                  </Link>
                </li></>
            )}
          </ul>
          <div className="sidebar-footer">
            <ul className="list-unstyled">
              <li>
                <Link to="/logout">
                  <span><IoMdLogOut /></span> Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
