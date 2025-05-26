import { useEffect, useState } from "react";
import Header from "../../layout/Header";
import Sidebar from "../../layout/Sidebar";
import { MdDelete } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  displayErrorToast,
  displaySuccessToast,
} from "../../../Utills/displayToasts";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { GrPrevious, GrNext } from "react-icons/gr";
import { getUserApi, updateUserApi } from "../../../services/user";
import { MdBlock } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Swal from "sweetalert2";
import { CgUnblock } from "react-icons/cg";
import SearchComponent from "../../../component/Search/Search";
import { IoInformationCircle } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { IoLogoAppleAppstore } from "react-icons/io5";
import { AiFillGoogleCircle } from "react-icons/ai";
import ImageModal from "../../layout/ImageModal";
import { IoMdArrowRoundUp, IoMdArrowRoundDown } from "react-icons/io";
import moment from "moment/moment";

// const recordsPerPage = 10;

function UserList() {
  const [searchText, setSearchText] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [userList, setUserList] = useState([]);
  const [mainArrayUser, setmainArrayUser] = useState({});
  const [url, setUrl] = useState("");
  const [imageModal, setImageModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [sortField, setSortField] = useState("createdAt"); // Default sort field
  const [sortOrder, setSortOrder] = useState(-1); // Default sort order: 1 for ascending, -1 for descending
  const [plan, setPlan] = useState("All");
  const location = useLocation();

  const navigate = useNavigate();
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const getUserList = async (page, size, search) => {
    setLoader(true);
    if (!mainArrayUser[page || selectedPage]) {
      const paginateData = {
        number: page || selectedPage,
        size,
        search: search,
        sortOrder,
        sortBy: sortField,
        planName: plan,
        type: location?.state?.type || "all",
      };
      const response = await getUserApi(paginateData);
      if (response?.success) {
        setUserList(response?.data?.users);
        setTotalPage(response?.data?.totalPages);
        const mergeData = {
          ...mainArrayUser,
          [page || selectedPage]: response?.data?.users,
        };
        setmainArrayUser(mergeData);
      } else {
        displayErrorToast(response?.message || "Something went wrong");
      }
      setLoader(false);
    } else {
      setUserList(mainArrayUser[page || selectedPage]);
    }
    setLoader(false);
  };

  const getUserList2 = async (
    page,
    size,
    search,
    field,
    order,
    subscription
  ) => {
    setLoader(true);
    const paginateData = {
      number: page || selectedPage,
      size,
      search: search,
      sortOrder: order || sortOrder,
      sortBy: field || sortField,
      planName: subscription || plan,
      type: location?.state?.type || "all",
    };
    const response = await getUserApi(paginateData);
    // console.log(response?.data)
    if (response?.success) {
      setUserList(response?.data?.users);
      setTotalPage(response?.data?.totalPages);
      const mergeData = {
        [page || selectedPage]: response?.data?.users,
      };
      setmainArrayUser(mergeData);
    } else {
      displayErrorToast(response?.message || "Something went wrong");
    }
    setLoader(false);
  };

  const clearAllStateData = () => {
    setSelectedPage(1);
    setSearchText("");
  };

  useEffect(() => {
    if (location?.state?.activePage) {
      setSelectedPage(location?.state?.activePage);
      clearAllStateData();
      getUserList(location?.state?.activePage, recordsPerPage, "");
    } else {
      getUserList2(1, recordsPerPage, "");
      clearAllStateData();
    }
  }, [
    location.pathname,
    recordsPerPage,
    plan,
    searchText,
    location?.state?.type,
  ]);

  const handlePageClick = async (data) => {
    const pageNo = data.selected + 1;
    setSelectedPage(pageNo);
    await getUserList(pageNo, recordsPerPage, searchText);
  };

  const onPressDeleteIcon = (data) => {
    Swal.fire({
      title: "Delete User",
      text: `Are you sure you want to delete this user?`,
      confirmButtonColor: "#127139",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        const response = await updateUserStatus(data?._id, "delete");
        if (response?.success) {
          await updateUserStatusLocally(data?._id, 2);
          // getUserList(selectedPage, recordsPerPage, searchText)
        }
      }
    });
  };

  const onPressBlockIcon = (data) => {
    Swal.fire({
      title: data?.status === 0 ? "Block User" : "Unblock User",
      html: `Are you sure you want to ${
        data?.status === 0 ? "block" : "unblock"
      } <b><span>${data?.firstName} ${data?.lastName}</span></b>?`,
      confirmButtonColor: "#127139",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        const response = await updateUserStatus(
          data?._id,
          data?.status === 0 ? "block" : "unblock"
        );
        if (response?.success) {
          await updateUserStatusLocally(data?._id, data?.status === 0 ? 1 : 0);
        }
      }
    });
  };

  const updateUserStatusLocally = async (id, status) => {
    const updatedList = userList?.map((user) => {
      return user?._id === id ? { ...user, status: status } : user;
    });
    setUserList(updatedList);
  };

  const onClickCloseIcon = async () => {
    setSelectedPage(1);
    setSearchText("");
    await getUserList2(1, recordsPerPage, "");
  };

  const onChangeSearchComponent = async (e) => {
    setSearchText(e?.target?.value);
    setSelectedPage(1);
    await getUserList2(1, recordsPerPage, e?.target?.value);
  };

  const handleImageModal = (img) => {
    setImageModal(true);
    setUrl(img);
  };

  function getActiveSubscriptionPlan(
    plan,
    isFreeTrial,
    freeTrialExpiryAt,
    expiresAt
  ) {
    if (!plan) return "-";

    const now = new Date();

    if (plan === "ease_free_trial") {
      return new Date(freeTrialExpiryAt) > now
        ? "Free Trial"
        : "Free Trial Expired";
    }

    if (plan === "ease_monthly") {
      return new Date(expiresAt) > now
        ? "Monthly Plan"
        : "Monthly Plan Expired";
    }
    if (plan === "ease_yearly") {
      return new Date(expiresAt) > now ? "Yearly Plan" : "Yearly Plan Expired";
    }

    return new Date(expiresAt) > now ? plan : "";
  }

  const updateUserStatus = async (id, status) => {
    const finalObject = {
      userId: id,
      action: status,
    };
    const response = await updateUserApi(finalObject);
    if (response?.success) {
      displaySuccessToast(response?.message);
    } else {
      displayErrorToast(response?.message);
    }
    return response;
  };

  const handleSort = async (field) => {
    const newSortOrder = sortField === field && sortOrder === 1 ? -1 : 1;
    setSortField(field);
    setSortOrder(newSortOrder);
    await getUserList2(
      selectedPage,
      recordsPerPage,
      searchText,
      field,
      newSortOrder
    );
  };

  const handleRecordsPerPageChange = async (value) => {
    const newRecordsPerPage = parseInt(value, 10);
    setRecordsPerPage(newRecordsPerPage);
    setSelectedPage(1); // Reset to the first page
    await getUserList2(1, parseInt(value, 10), searchText); // Fetch new data based on the new records per page
  };

  const handlePlanChange = async (value) => {
    setPlan(value);
    setSelectedPage(1); // Reset to the first page
    await getUserList2(
      1,
      recordsPerPage,
      searchText,
      sortField,
      sortOrder,
      value
    ); // Fetch new data based on the new records per page
  };

  return (
    <div data-sidebar="dark">
      <div id="layout-wrapper">
        {imageModal && (
          <ImageModal
            activeModal={imageModal}
            setActiveModal={() => {
              setImageModal(false);
              setUrl("");
            }}
            img={url}
            flag="Profile Image"
          />
        )}
        <Header />
        <Sidebar />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                    <h4 className="mb-sm-0">User Management</h4>

                    <div className="page-title-right">
                      <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item">
                          <a href="/dashboard">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item active">
                          User Management
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingBottom: "15px",
                        }}
                      >
                        <h4 className="card-title">List of User</h4>
                        <div style={{ display: "flex" }}>
                          <div style={{ marginRight: "10px" }}>
                            <select
                              className="form-select"
                              value={recordsPerPage}
                              onChange={(e) =>
                                handleRecordsPerPageChange(e.target.value)
                              }
                              style={{ height: "40px" }}
                            >
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                            </select>
                          </div>
                          <div style={{ marginRight: "10px" }}>
                            <select
                              className="form-select"
                              value={plan}
                              onChange={(e) => handlePlanChange(e.target.value)}
                              style={{ height: "40px" }}
                            >
                              <option value="">All</option>
                              <option value="ease_free_trial">
                                Free Trial Plan
                              </option>
                              <option value="ease_monthly">Monthly Plan</option>
                              <option value="ease_yearly">Yearly Plan</option>
                            </select>
                          </div>
                          <SearchComponent
                            data={searchText}
                            onChange={(data) => onChangeSearchComponent(data)}
                            onClickCloseIcon={onClickCloseIcon}
                          />
                        </div>
                      </div>
                      <div style={{ overflow: "auto" }}>
                        <table
                          id="datatable"
                          className="table table-bordered dt-responsive nowrap"
                          style={{
                            borderCollapse: "collapse",
                            borderSpacing: "0",
                            width: "100%",
                          }}
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Profile Picture</th>
                              <th
                                onClick={() => handleSort("firstName")}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="d-flex flex-row justify-content-between">
                                  Name{" "}
                                  {sortField === "firstName" &&
                                    (sortOrder === 1 ? (
                                      <IoMdArrowRoundUp fontSize={20} />
                                    ) : (
                                      <IoMdArrowRoundDown fontSize={20} />
                                    ))}
                                </div>
                              </th>
                              <th>Email</th>
                              <th>Subscription Plan</th>
                              <th
                                onClick={() => handleSort("createdAt")}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="d-flex flex-row justify-content-between">
                                  Date{" "}
                                  {sortField === "createdAt" &&
                                    (sortOrder === 1 ? (
                                      <IoMdArrowRoundUp fontSize={20} />
                                    ) : (
                                      <IoMdArrowRoundDown fontSize={20} />
                                    ))}
                                </div>
                              </th>
                              <th
                                onClick={() => handleSort("registerType")}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="d-flex flex-row justify-content-between">
                                  Login Type{" "}
                                  {sortField === "registerType" &&
                                    (sortOrder === 1 ? (
                                      <IoMdArrowRoundUp fontSize={20} />
                                    ) : (
                                      <IoMdArrowRoundDown fontSize={20} />
                                    ))}
                                </div>
                              </th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loader ? (
                              <tr>
                                <td colSpan={8} className="text-center">
                                  Loading ...
                                </td>
                              </tr>
                            ) : userList?.length > 0 ? (
                              userList?.map((elem, index) => {
                                return (
                                  <tr
                                    key={elem?._id}
                                    className="text-container"
                                  >
                                    <td>
                                      {recordsPerPage * (selectedPage - 1) +
                                        (index + 1)}
                                    </td>
                                    {elem?.profilePic === "" ? (
                                      <td
                                        style={{
                                          maxWidth: "100px",
                                          alignContent: "center",
                                          whiteSpace: "normal",
                                        }}
                                      >
                                        {
                                          <div className="d-flex flex-row justify-content-center">
                                            <img
                                              loading="lazy"
                                              style={{ height: "50px" }}
                                              src={"/images/users/user.png"}
                                            />
                                          </div>
                                        }
                                      </td>
                                    ) : (
                                      <td
                                        style={{
                                          maxWidth: "100px",
                                          alignContent: "center",
                                          whiteSpace: "normal",
                                        }}
                                      >
                                        {
                                          <div className="d-flex flex-row justify-content-center">
                                            <img
                                              loading="lazy"
                                              src={elem?.profilePic}
                                              style={{
                                                height: "100px",
                                                width: "100px",
                                                objectFit: "cover",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                handleImageModal(
                                                  elem?.profilePic
                                                );
                                              }}
                                            />
                                          </div>
                                        }
                                      </td>
                                    )}
                                    <td style={{ maxWidth: "200px" }}>
                                      <div className="two-line-text">
                                        {elem?.firstName} {elem?.lastName}
                                      </div>
                                    </td>
                                    <td>{elem?.email ? elem?.email : "-"}</td>
                                    <td>
                                      {getActiveSubscriptionPlan(
                                        elem?.subscriptionPlan,
                                        elem?.isFreeTrial,
                                        elem?.freeTrialExpiryAt,
                                        elem?.expiresAt
                                      )}
                                    </td>

                                    <td>
                                      {moment(elem?.createdAt).format(
                                        "MMMM Do YYYY"
                                      )}
                                    </td>
                                    <td>
                                      {elem?.registerType === 0 ? (
                                        <MdEmail fontSize={20} />
                                      ) : (
                                        <>
                                          <AiFillGoogleCircle fontSize={20} /> /{" "}
                                          <IoLogoAppleAppstore fontSize={20} />
                                        </>
                                      )}
                                    </td>

                                    <td
                                      style={{
                                        display: "flex flex-start",
                                        cursor: "pointer",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {elem?.status === 2 ? (
                                        <span
                                          style={{
                                            color: "red",
                                            cursor: "default",
                                          }}
                                        >
                                          User Deleted
                                        </span>
                                      ) : elem?.status === 0 ? (
                                        <>
                                          <ReactTooltip id="Block-user" />
                                          <MdBlock
                                            data-tooltip-place="bottom"
                                            data-tooltip-id="Block-user"
                                            data-tooltip-content="Block User"
                                            size={20}
                                            style={{
                                              marginRight: "10px",
                                              color: "red",
                                            }}
                                            onClick={() =>
                                              onPressBlockIcon(elem)
                                            }
                                          />
                                          <ReactTooltip id="Delete-user" />
                                          <MdDelete
                                            data-tooltip-place="bottom"
                                            data-tooltip-id="Delete-user"
                                            data-tooltip-content="Delete User"
                                            size={20}
                                            style={{ marginRight: "10px" }}
                                            onClick={() =>
                                              onPressDeleteIcon(elem)
                                            }
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <ReactTooltip id="unBlock-user" />
                                          <CgUnblock
                                            data-tooltip-place="bottom"
                                            data-tooltip-id="unBlock-user"
                                            data-tooltip-content="Unblock User"
                                            size={22}
                                            style={{
                                              marginRight: "8px",
                                              color: "green",
                                            }}
                                            onClick={() =>
                                              onPressBlockIcon(elem)
                                            }
                                          />
                                          <ReactTooltip id="Delete-user" />
                                          <MdDelete
                                            data-tooltip-place="bottom"
                                            data-tooltip-id="Delete-user"
                                            data-tooltip-content="Delete User"
                                            size={20}
                                            style={{ marginRight: "10px" }}
                                            onClick={() =>
                                              onPressDeleteIcon(elem)
                                            }
                                          />
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={6}>No Users found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  justifyContent: "center",
                  width: "100%",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ReactPaginate
                  previousLabel={<GrPrevious style={{ color: "black" }} />}
                  nextLabel={<GrNext style={{ color: "black" }} />}
                  pageCount={totalPage || 0}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  activeClassName={"active-pagination bg-primary"}
                  forcePage={selectedPage - 1}
                  pageLinkClassName={"list-item-paginate-class-name"}
                />
              </div>
              {/* <div className="pagination-container">
                <div className="pagination-wrapper">
                  <ReactPaginate
                    previousLabel={<GrPrevious style={{ color: "black" }} />}
                    nextLabel={<GrNext style={{ color: "black" }} />}
                    pageCount={totalPage || 1}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active-pagination bg-primary"}
                    forcePage={selectedPage - 1}
                    pageLinkClassName={"list-item-paginate-class-name"}
                  />
                </div>
                <div className="dropdown-wrapper">
                  <select
                    className="form-select"
                    value={recordsPerPage}
                    onChange={(e) => handleRecordsPerPageChange(e.target.value)}
                    style={{ height: '40px' }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;
