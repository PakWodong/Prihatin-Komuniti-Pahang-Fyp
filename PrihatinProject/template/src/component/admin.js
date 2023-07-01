import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto"
import "chart.js/auto";
import '../css/main.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Admin() {
  const [NewRequest, setNewRequest] = useState(0);
  const [ApprovedRequest, setApprovedRequest] = useState(0);
  const [RejectedRequest, setRejectedRequest] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [donorMoney, setNewDonor] = useState(0);
  const [recepientMoney, setNewRecepient] = useState(0);
  const [lastSevenDays, setLastSevenDays] = useState([]);
  const chartContainerRef = useRef(null);
  const [chart, setChart] = useState(null);
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
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      window.location.href = '/login';
      return;
    }
    else {
      setIsLoading(true);
      fetch(`${process.env.REACT_APP_API_URL}/donation/request/`)
        .then(response => response.json())
        .then(data => {
          let newCount = 0;
          let approvedCount = 0;
          let rejectedCount = 0;
          data.forEach(request => {
            if (request.status === 'Pending') {
              newCount++;
            } else if (request.status === 'Approved') {
              approvedCount++;
            } else if (request.status === 'Rejected') {
              rejectedCount++;
            }
          });
          setNewRequest(newCount);
          setApprovedRequest(approvedCount);
          setRejectedRequest(rejectedCount);

        })
        .catch(error => {
          console.error(error);
          handleError('An error occurred while fetching the data');
        });

      fetch(`${process.env.REACT_APP_API_URL}/donationtransaction/add/`)
        .then(response => response.json())
        .then(data => {
          let all = 0;
          let donor = 0;
          let recepient = 0;
          data.forEach(request => {
            if (request.donation_type === 'donor') {
              donor = donor + parseFloat(request.amount);
            } else if (request.donation_type === 'recipient') {
              recepient = recepient + parseFloat(request.amount);
            }
          });
          setIsLoading(false);
          all = donor - recepient;
          setNewDonor(donor);
          setTotalMoney(all);
          setNewRecepient(recepient);
          const currentDate = new Date();
          // const lastSevenDays = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() - (i - 1));
            const formattedDate = date.toISOString().split("T")[0];
            date.setDate(currentDate.getDate() - (i));
            const newDate = date.toISOString().split("T")[0];

            const totalMoneyForDay = data.reduce((total, request) => {
              if (new Date(request.donation_date) <= new Date(formattedDate)) {
                if (request.donation_type === "donor") {
                  return total + parseFloat(request.amount);
                } else if (request.donation_type === "recipient") {
                  return total - parseFloat(request.amount);
                }
              }
              return total;
            }, 0);
            lastSevenDays.push({
              date: newDate,
              totalMoney: totalMoneyForDay
            });
          }
          setLastSevenDays(lastSevenDays);
          if (chartContainerRef.current && lastSevenDays.length > 0) {
            const labels = lastSevenDays.map((day) => day.date);
            const data = lastSevenDays.map((day) => day.totalMoney);

            if (chart) {
              chart.data.labels = labels;
              chart.data.datasets[0].data = data;
              chart.update();
            } else {
              const ctx = chartContainerRef.current.getContext("2d");
              const newChart = new Chart(ctx, {
                type: "line",
                data: {
                  labels,
                  datasets: [
                    {
                      label: "Total Money",
                      data,
                      backgroundColor: "#8f8de6",
                      borderColor: "#8f8de6",
                      borderWidth: 2,
                      pointRadius: 4,
                      pointBackgroundColor: "#8f8de6",
                      pointBorderColor: "#fff",
                      pointHoverRadius: 6,
                      pointHoverBackgroundColor: "#8f8de6",
                      pointHoverBorderColor: "#fff",
                      pointHitRadius: 8,
                    },
                  ],
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: true,
                      title: {
                        display: true,
                        text: "Date",
                      },
                    },
                    y: {
                      display: true,
                      title: {
                        display: true,
                        text: "Total Money",
                      },
                    },
                  },
                },
              });
              setChart(newChart);
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    };

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
          <h2>Overview</h2>
          <div className="Prihatin">
            | Prihatin Komuniti Pahang
          </div>
        </div>
        <div className="container">
          <div className="box">
            <h4>New Donation Request</h4>
            <p>{NewRequest}</p>
          </div>
          <div className="box">
            <h4>Rejected Donation Request</h4>
            <p>{RejectedRequest}</p>
          </div>
          <div className="box">
            <h4>Accepted Donation Request</h4>
            <p>{ApprovedRequest}</p>
          </div>
        </div>
        <div className="infoContainer">
          <div className="infoContainer1">
            <canvas ref={chartContainerRef}></canvas>
          </div>
          <div className="infoContainer2">
            <div className="titleBox">
              <h3>Transaction Detail</h3>
            </div>
            <hr />
            <div className="info">
              <h4>Total Money Left</h4>
              <h4 style={{ marginLeft: "auto" }}>RM{totalMoney.toFixed(2)}</h4>
            </div>
            <hr />
            <div className="info">
              <h4>Money Received</h4>
              <h4 style={{ marginLeft: "auto" }}>RM{donorMoney.toFixed(2)}</h4>
            </div>
            <hr />
            <div className="info">
              <h4>Money Spend</h4>
              <h4 style={{ marginLeft: "auto" }}>RM{recepientMoney.toFixed(2)}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
