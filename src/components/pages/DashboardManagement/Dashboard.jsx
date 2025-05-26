import React, { useEffect, useState } from "react";
import {
  AiOutlineUser,
  AiOutlineDollarCircle,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "../../layout/Header";
import Sidebar from "../../layout/Sidebar";
import { getDashboard } from "../../../services/dashboard";
import { useNavigate } from "react-router-dom";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);

  const getData = async () => {
    const data = await getDashboard();
    setDashboardData(data?.data);
  };

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  // const stats = [
  //     { title: "Total Users", value: dashboardData?.totalUsers || 0, icon: <AiOutlineUser fontSize={30} />, color: "bg-primary" },
  //     { title: "Total Paid Users", value: dashboardData?.paidUsers || 0, icon: <AiOutlineDollarCircle fontSize={30} />, color: "bg-success" },
  //     { title: "Total Free Users", value: dashboardData?.freeUsers || 0, icon: <FiUsers fontSize={30} />, color: "bg-warning" },
  //     // { title: "Total Revenue", value: dashboardData?.revenue ? "$" + dashboardData?.revenue : "$" + 0, icon: <AiOutlineDollarCircle fontSize={30} />, color: "bg-info" },
  //     { title: "Total Active Users", value: dashboardData?.activeUser || 0, icon: <AiOutlineUsergroupAdd fontSize={30} />, color: "bg-danger" }
  // ];

  const stats = [
    {
      title: "Total Users",
      value: dashboardData?.totalUsers || 0,
      icon: <AiOutlineUser fontSize={30} />,
      color: "bg-primary",
      type: null,
      activePage: 1,
    },
    {
      title: "Total Paid Users",
      value: dashboardData?.paidUsers || 0,
      icon: <AiOutlineDollarCircle fontSize={30} />,
      color: "bg-success",
      type: "paidUser",
      activePage: 1,
    },
    {
      title: "Total Free Users",
      value: dashboardData?.freeUsers || 0,
      icon: <FiUsers fontSize={30} />,
      color: "bg-warning",
      type: "freeUser",
      activePage: 1,
    },
    {
      title: "Total Active Users",
      value: dashboardData?.activeUser || 0,
      icon: <AiOutlineUsergroupAdd fontSize={30} />,
      color: "bg-danger",
      type: "activeUser",
      activePage: 1,
    },
  ];

  // const barData = {
  //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //     datasets: [
  //         {
  //             label: 'Website Views',
  //             backgroundColor: 'rgba(75,192,192,1)',
  //             borderColor: 'rgba0,0,0,1)',
  //             borderWidth: 2,
  //             data: [65, 59, 80, 81, 56, 55, 40, 70, 60, 90, 75, 80]
  //         }
  //     ]
  // };

  // const lineData = {
  //     labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  //     datasets: [
  //         {
  //             label: 'Daily Earnings',
  //             fill: false,
  //             lineTension: 0.5,
  //             backgroundColor: 'rgba(75,192,192,1)',
  //             borderColor: 'rgba(75,192,192,1)',
  //             borderWidth: 2,
  //             data: [2000, 4000, 3000, 5000, 7000, 8000, 10000]
  //         }
  //     ]
  // };

  const handleStatClick = (stat) => {
    const stateToPass = {
      type: stat.type,
      title: stat.title,
      activePage: stat.activePage,
    };
    navigate("/user", { state: stateToPass });
  };

  return (
    <div data-sidebar="dark">
      <div id="layout-wrapper">
        <Header />
        <Sidebar />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                    <h4 className="mb-sm-0">Dashboard & Analytics</h4>
                  </div>
                </div>
              </div>

              {/* <div className="row">
                {stats.map((stat, index) => (
                  <div className="col-md-6 col-xl-3" key={index}>
                    <div className={`card ${stat.color} text-white`}>
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="me-3 align-self-center">
                            {stat.icon}
                          </div>
                          <div className="flex-grow-1 text-end">
                            <h4 className="mb-1 text-white">{stat.value}</h4>
                            <p className="mb-0">{stat.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div> */}

              <div className="row">
                {stats.map((stat, index) => (
                  <div
                    className="col-md-6 col-xl-3"
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleStatClick(stat)}
                  >
                    <div className={`card ${stat.color} text-white`}>
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="me-3 align-self-center">
                            {stat.icon}
                          </div>
                          <div className="flex-grow-1 text-end">
                            <h4 className="mb-1 text-white">{stat.value}</h4>
                            <p className="mb-0">{stat.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* <div className="row">
                                <div className="col-xl-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="card-title">Website Views</h4>
                                            <Bar data={barData} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="card-title">Daily Earnings</h4>
                                            <Line data={lineData} />
                                        </div>
                                    </div>
                                </div>
                            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
