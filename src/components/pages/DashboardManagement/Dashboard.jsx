import ReactPaginate from "react-paginate"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
// import FilterUsers from "./FilterUsers"
import { GrPrevious, GrNext } from "react-icons/gr";
import { useState } from "react";

const Dashboard = () => {
    const [totalPage, setTotalPage] = useState(0)

    const handlePageClick = async (data) => {
        const pageNo = data.selected + 1;
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
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="pb-4" style={{ display: "flex", justifyContent: "space-between" }}>
                                                        {/* <FilterUsers /> */}
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "15px" }}>
                                                        <h4 className="card-title">List of Users</h4>
                                                    </div>
                                                    <table id="datatable" className="table table-bordered dt-responsive nowrap" style={{ borderCollapse: "collapse", borderSpacing: "0", width: "100%" }}>
                                                        <thead>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>Email</th>
                                                                <th>Role</th>
                                                                <th>Set up</th>
                                                            </tr>
                                                        </thead>
                                                        {/* <tbody>
                                                        {loader ? <tr><td>Loading...</td></tr> : subAdmin?.length > 0 ?
                                                            subAdmin?.map((elem, index) => {
                                                                return (
                                                                    <tr key={elem?._id}>
                                                                        <td>{(numberPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                                                        <td>{elem?.email}</td>
                                                                        <td>{elem?.permission == 1 ? "View" : "Edit"}</td>
                                                                        <td>
                                                                            {
                                                                                elem?.name ?
                                                                                    <TiTick className="tickmark-wrpper" style={{ color: "green" }} /> :
                                                                                    <TiTimes className="tickmark-wrpper" style={{ color: "red" }} />
                                                                            }
                                                                        </td>
                                                                        {(userRoleType?.type == userRoleTypeForSuper) &&
                                                                            <td style={{ display: "flex", cursor: "pointer" }}>
                                                                                <MdDelete style={{ marginRight: "10px" }} size={20} onClick={() => onPressDeleteIcon(elem)} />
                                                                            </td>
                                                                        }
                                                                    </tr>
                                                                )
                                                            }
                                                            )
                                                            : <tr><td>No reviews found</td></tr>}
                                                    </tbody> */}
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ justifyContent: "center", width: "100%", alignItems: "center", display: "flex" }}>
                                        <ReactPaginate
                                            previousLabel={<GrPrevious style={{ color: "black" }} />}
                                            nextLabel={<GrNext style={{ color: "black" }} />}
                                            pageCount={totalPage || 0}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={handlePageClick}
                                            containerClassName={"pagination"}
                                            activeClassName={"active-pagination bg-primary"}
                                        // forcePage={ }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Dashboard