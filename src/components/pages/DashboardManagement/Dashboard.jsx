import React, { useState } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { AiOutlineUser, AiOutlineDollarCircle, AiOutlineUsergroupAdd } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import Header from "../../layout/Header";
import Sidebar from "../../layout/Sidebar";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);


const Dashboard = () => {
    const [totalPage] = useState(10); // Static total pages

    const handlePageClick = (data) => {
        const pageNo = data.selected + 1;
        console.log(`User requested page number ${pageNo}`);
        // Fetch new page data based on pageNo (Static data so no fetching here)
    };

    const stats = [
        { title: "Total Users", value: 1000, icon: <AiOutlineUser fontSize={30} />, color: "bg-primary" },
        { title: "Total Paid Users", value: 300, icon: <AiOutlineDollarCircle fontSize={30} />, color: "bg-success" },
        { title: "Total Free Users", value: 700, icon: <FiUsers fontSize={30} />, color: "bg-warning" },
        { title: "Total Revenue", value: "$34,245", icon: <AiOutlineDollarCircle fontSize={30} />, color: "bg-info" },
        { title: "Total Active Users", value: 800, icon: <AiOutlineUsergroupAdd fontSize={30} />, color: "bg-danger" }
    ];

    const barData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Website Views',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba0,0,0,1)',
                borderWidth: 2,
                data: [65, 59, 80, 81, 56, 55, 40, 70, 60, 90, 75, 80]
            }
        ]
    };

    const lineData = {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        datasets: [
            {
                label: 'Daily Earnings',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                data: [2000, 4000, 3000, 5000, 7000, 8000, 10000]
            }
        ]
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

                            <div className="row">
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
                            </div>

                            <div className="row">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
