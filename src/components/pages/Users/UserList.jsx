import { useEffect, useState } from "react"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import { MdDelete } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { GrPrevious, GrNext } from "react-icons/gr";
import { getUserApi } from "../../../services/user";
import { MdBlock } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Swal from "sweetalert2";
import { CgUnblock } from "react-icons/cg"
import SearchComponent from "../../../component/Search/Search";
import { IoInformationCircle } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { IoLogoAppleAppstore } from "react-icons/io5";
import { AiFillGoogleCircle } from "react-icons/ai";
import ImageModal from "../../layout/ImageModal";


const numberPerPage = 10;

function UserList() {

  const [searchText, setSearchText] = useState("")
  const [totalPage, setTotalPage] = useState(0)
  const [selectedPage, setSelectedPage] = useState(1)
  const [userList, setUserList] = useState([])
  const [url, setUrl] = useState("");
  const [imageModal, setImageModal] = useState(false);
  const [loader, setLoader] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const getUserList = async (page, size, search) => {
    setLoader(true)
    const finalObject = {
      size,
      number: page,
      search: search
    }
    const response = await getUserApi(finalObject)
    console.log(response)
    if (response?.success) {
      setUserList(response?.data?.users)
      setTotalPage(response?.data?.totalPages)
    } else {
      displayErrorToast(response?.message || "Something went wrong")
    }
    setLoader(false)
  }

  const clearAllStateData = () => {
    setSelectedPage(1)
    setSearchText("")
  }

  useEffect(() => {
    if (location?.state?.activePage) {
      setSelectedPage(location?.state?.activePage)
      getUserList(location?.state?.activePage, numberPerPage, "")

    } else {
      getUserList(1, numberPerPage, "")
      clearAllStateData()
    }
  }, [location.pathname])

  const handlePageClick = async (data) => {

    const pageNo = data.selected + 1;
    setSelectedPage(pageNo)
    await getUserList(pageNo, numberPerPage, searchText)
  };

  const onPressDeleteIcon = (data) => {
    Swal.fire({
      title: "Delete User",
      text: `Are you sure you want to delete this user?`,
      confirmButtonColor: '#127139',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        const response = await deleteUserApi(data?._id);
        if (response?.success) {
          await updateUserStatusLocally(data?._id, 3);
          // getUserList(selectedPage, numberPerPage, searchText)
          displaySuccessToast("User Deleted successfully");
        } else {
          displayErrorToast(response?.message);
        }
      }
    })
  }

  const onPressBlockIcon = (data) => {
    Swal.fire({
      title: data?.status !== userStatus?.block ? "Block User" : "Unblock User",
      text: `Are you sure you want to ${data?.status !== userStatus?.block ? "block" : "unblock"} this user?`,
      confirmButtonColor: '#127139',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        const response = await blockUserApi(data?._id, data?.status !== userStatus?.block ? userStatus?.block : userStatus?.active);
        await updateUserStatusLocally(data?._id, data?.status !== userStatus?.block ? userStatus?.block : userStatus?.active);
        if (response?.success) {
          displaySuccessToast(response?.message || "User Block successfully");
        } else {
          displayErrorToast(response?.message);
        }
      }
    })
  }

  const updateUserStatusLocally = async (id, status) => {
    const updatedList = userList?.map((user) => {
      return user?._id === id ? { ...user, status: status } : user;
    });
    setUserList(updatedList)
  };

  const onClickCloseIcon = async () => {
    setSelectedPage(1)
    setSearchText("")
    await getUserList(1, numberPerPage, "")
  }

  const onChangeSearchComponent = async (e) => {
    setSearchText(e?.target?.value)
    setSelectedPage(1)
    await getUserList(1, numberPerPage, e?.target?.value)
  }

  const handleImageModal = (img) => {
    setImageModal(true);
    setUrl(img)
  }

  return (
    <div data-sidebar="dark">
      <div id="layout-wrapper">
        {imageModal && <ImageModal
          activeModal={imageModal}
          setActiveModal={() => { setImageModal(false); setUrl(""); }}
          img={url}
          flag="Profile Image"
        />}
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
                        <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                        <li className="breadcrumb-item active">User Management</li>
                      </ol>
                    </div>

                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "15px" }}>
                        <h4 className="card-title">List of User</h4>
                        <SearchComponent
                          data={searchText}
                          onChange={(data) => onChangeSearchComponent(data)}
                          onClickCloseIcon={onClickCloseIcon} />
                      </div>
                      <div style={{ overflow: "auto" }}>
                        <table id="datatable" className="table table-bordered dt-responsive nowrap" style={{ borderCollapse: "collapse", borderSpacing: "0", width: "100%" }}>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Profile Pic</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Login Type</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loader ? <tr><td colSpan={6}>Loading ...</td></tr> : userList?.length > 0 ?
                              userList?.map((elem, index) => {
                                return (
                                  <tr key={elem?._id} className="text-container">
                                    <td>{(numberPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                    {(elem?.profilePic === "") ?
                                      <td>-</td> :
                                      <td style={{ maxWidth: "100px", alignContent: 'center', whiteSpace: 'normal' }}>{<div className="d-flex flex-row justify-content-center"><img loading="lazy" src={elem?.profilePic} style={{ height: "100px", width: "100px", objectFit: 'cover', overflow: 'hidden', cursor: "pointer" }} onClick={() => { handleImageModal(elem?.profilePic) }} /></div>}</td>}
                                    <td style={{ maxWidth: "200px" }}>
                                      <div className="two-line-text">
                                        {elem?.firstName}{" "} {elem?.lastName}
                                      </div>
                                    </td>
                                    <td>{elem?.email ? elem?.email : "-"}</td>
                                    <td style={{ textAlign: 'center' }} >{elem?.registerType === 0 ? <MdEmail fontSize={20} /> : <><AiFillGoogleCircle fontSize={20} /> / <IoLogoAppleAppstore fontSize={20} /></>}</td>

                                    <td style={{ display: "flex", cursor: "pointer" }}>
                                      <ReactTooltip id="User-info" />
                                      {elem?.business_onboarding_completed && location.pathname == "/bussiness-user-list" &&
                                        <IoInformationCircle
                                          style={{ marginRight: "10px" }}
                                          data-tooltip-place="bottom"
                                          data-tooltip-id="User-info"
                                          data-tooltip-content="Info"
                                          size={20}
                                          onClick={() => navigate(location.pathname == "/user-list" ? "/user-list/view-bussiness-user-detail" : "/bussiness-user-list/view-bussiness-user-detail", { state: { data: elem, selectedPage, pathname: location?.pathname } })}
                                        />
                                      }

                                      {/* {
                                        elem?.status !== userStatus?.delete ?
                                          <>
                                            {elem?.status !== userStatus?.block ?
                                              <>
                                                <ReactTooltip id="Block-user" />
                                                <MdBlock
                                                  data-tooltip-place="bottom"
                                                  data-tooltip-id="Block-user"
                                                  data-tooltip-content="Block User"
                                                  size={20}
                                                  style={{ marginRight: "10px", color: "red" }}
                                                  onClick={() => onPressBlockIcon(elem)} />
                                              </> :
                                              <>
                                                <ReactTooltip id="unBlock-user" />
                                                <CgUnblock
                                                  data-tooltip-place="bottom"
                                                  data-tooltip-id="unBlock-user"
                                                  data-tooltip-content="Unblock User"
                                                  size={22}
                                                  style={{ marginRight: "8px", color: "green" }}
                                                  onClick={() => onPressBlockIcon(elem)} />
                                              </>
                                            }

                                            <ReactTooltip id="Delete-user" />
                                            <MdDelete
                                              data-tooltip-place="bottom"
                                              data-tooltip-id="Delete-user"
                                              data-tooltip-content="Delete User"
                                              size={20}
                                              style={{ marginRight: "10px" }}
                                              onClick={() => onPressDeleteIcon(elem)} />
                                          </> : <span style={{ marginRight: "10px" }}>User Deleted</span>} */}
                                      <ReactTooltip id="User-info" />
                                      {elem?.business_onboarding_completed && location.pathname == "/user-list" ?
                                        <IoInformationCircle
                                          style={{ marginRight: "10px" }}
                                          data-tooltip-place="bottom"
                                          data-tooltip-id="User-info"
                                          data-tooltip-content="Info"
                                          size={20}
                                          onClick={() => navigate(location.pathname == "/user-list" ? "/user-list/view-bussiness-user-detail" : "/bussiness-user-list/view-bussiness-user-detail", { state: { data: elem, selectedPage, pathname: location?.pathname } })}
                                        />
                                        : <span style={{ marginRight: "30px" }}></span>
                                      }
                                    </td>
                                  </tr>
                                )
                              }
                              )
                              : <tr><td colSpan={6}>No Users found</td></tr>}
                          </tbody>
                        </table>
                      </div>
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
                  forcePage={selectedPage - 1}
                  pageLinkClassName={"list-item-paginate-class-name"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserList