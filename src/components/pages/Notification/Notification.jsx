import { useEffect, useState } from "react"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import AddNotification from "./AddNotification"
import "./Notification.css"
import { getNotification, deleteNotification } from "../../../services/notification"
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts"
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { MdDelete } from "react-icons/md"
import ReactPaginate from "react-paginate"
import { GrPrevious, GrNext } from "react-icons/gr";
import { getLoggedinUserProfile } from "../../../services/profile"
import _ from "lodash";
import Swal from "sweetalert2"
import SearchComponent from "../../../component/Search/Search"

function Notification() {

    const [openNotification, setopenNotification] = useState(false)
    const [loader, setLoader] = useState(true)
    const [Notification, setNotification] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [selectedPage, setSelectedPage] = useState(1);
    const [mainArrayNotification, setMainArrayNotification] = useState({})
    const [searchText, setSearchText] = useState("")
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const onClickAddNotification = (data) => {
        setopenNotification(data)
    }

    const appendDataInAdd = async () => {
        setLoader(true)
        setSelectedPage(1)
        const paginateData = {
            page: 1,
            limit: recordsPerPage,
            search: searchText,
        }
        const data = await getNotification(paginateData)
        if (data?.success) {
            let paginateData = data?.data?.notification
            // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(data?.data?.totalPages)
            const mergeData = { [1]: paginateData }
            setMainArrayNotification(mergeData)
            setNotification(paginateData)
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getNotificationList2 = async (select, size, search) => {
        setLoader(true)
        const paginateData = {
            page: select,
            limit: size || recordsPerPage,
            search: search,
        }
        const data = await getNotification(paginateData)
        if (data?.success) {
            let paginateData = data?.data?.notification;
            // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(data?.data?.totalPages)
            const mergeData = { ...mainArrayNotification, [select || selectedPage]: paginateData }
            setMainArrayNotification(mergeData)
            setNotification(paginateData)
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getNotificationList = async (select) => {
        setLoader(true)
        if (!mainArrayNotification[select || selectedPage]) {
            const paginateData = {
                page: select || selectedPage,
                limit: recordsPerPage,
                search: searchText,
            }
            const data = await getNotification(paginateData)
            if (data?.success) {
                let paginateData = data?.data?.notification;
                // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTotalPage(data?.data?.totalPages)
                const mergeData = { ...mainArrayNotification, [select || selectedPage]: paginateData }
                setMainArrayNotification(mergeData)
                setNotification(paginateData)
            }
            else {
                displayErrorToast(data?.message || "something went wrong while fetching data")
            }
            setLoader(false)
        }
        else {
            setNotification(mainArrayNotification[select || selectedPage])
        }
        setLoader(false)
    }

    useEffect(() => {
        setLoader(true)
        getNotificationList()
        getUserProfile()
    }, [])

    const onPressDeleteIcon = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete this notification`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const object = {};
                object.id = data?._id;

                await deleteNotification(object).then(async (submit) => {
                    if (submit?.success) {
                        displaySuccessToast(submit.message || "Deleted successfully")
                        if (Notification.length === 1 && selectedPage > 1) {
                            setSelectedPage(selectedPage - 1)
                            await getNotificationList2(selectedPage - 1)

                        }
                        else {
                            await getNotificationList2(selectedPage)
                        }
                    }
                    else {
                        displayErrorToast(submit?.message || "something went wrong while deleteing data")
                    }
                });
            }
        })
    }

    const handlePageClick = async (data) => {
        setLoader(true)
        const pageNo = data.selected + 1;
        await getNotificationList(pageNo)
        setSelectedPage(pageNo);
    };

    const getUserProfile = async () => {
        const profileData = await getLoggedinUserProfile()
        if (!profileData?.success) {
            localStorage.clear()
            window.location.reload();
            displayErrorToast(profileData?.message || "something went wrong while get user profile")
        }
    }

    const onClickCloseIcon = async () => {
        setSelectedPage(1)
        setSearchText("")
        await getNotificationList2(1, recordsPerPage, "")
    }

    const onChangeSearchComponent = async (e) => {
        setSearchText(e?.target?.value)
        setSelectedPage(1)
        await getNotificationList2(1, recordsPerPage, e?.target?.value)
    }

    const handleRecordsPerPageChange = async (value) => {
        const newRecordsPerPage = parseInt(value, 10);
        setRecordsPerPage(newRecordsPerPage);
        setSelectedPage(1); // Reset to the first page
        await getNotificationList2(1, parseInt(value, 10), searchText); // Fetch new data based on the new records per page
    };

    // const handleSort = async (field) => {
    //     const newSortOrder = (sortField === field && sortOrder === 1) ? -1 : 1;
    //     setSortField(field);
    //     setSortOrder(newSortOrder);
    //     await getNotificationList2(selectedPage, recordsPerPage, searchText);
    // };


    return (
        <>
            <div data-sidebar="dark">
                {
                    openNotification && <AddNotification
                        appendDataInAdd={appendDataInAdd}
                        closeWrapper={onClickAddNotification} />
                }
                <div id="layout-wrapper">
                    <Header />
                    <Sidebar />
                    <div className="main-content" style={{ minHeight: "100vh" }}>
                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                            <h4 className="mb-sm-0">Notification Management</h4>
                                            <div className="page-title-right">
                                                <ol className="breadcrumb m-0">
                                                    <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                                                    <li className="breadcrumb-item active">Notification Management</li>
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
                                                    <h4 className="card-title">List of Notification</h4>
                                                    <div className="d-flex flex-row">
                                                        <div style={{ marginRight: "10px" }}>
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
                                                        <SearchComponent
                                                            data={searchText}
                                                            onChange={(data) => onChangeSearchComponent(data)}
                                                            onClickCloseIcon={onClickCloseIcon} />
                                                        <div className="d-grid">
                                                            <button className="btn btn-primary waves-effect waves-light" type="buttom" style={{ height: '40px', marginLeft: '10px' }} onClick={() => onClickAddNotification(true)} >Add Notification</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ overflow: "auto" }}>
                                                    <table id="datatable" className="table table-bordered dt-responsive nowrap" style={{ borderCollapse: "collapse", borderSpacing: "0", width: "100%" }}>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th style={{ maxWidth: "200px" }}>Title</th>
                                                                <th style={{ maxWidth: "200px" }}>Description</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loader ? <tr style={{ textAlign: 'center' }}><td colSpan={4}>Loading ...</td></tr> : Notification?.length > 0 ?
                                                                Notification?.map((elem, index) => {
                                                                    return (
                                                                        <tr key={elem?._id}>
                                                                            <td>{(recordsPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                                                            <td style={{ maxWidth: '200px' }}>{elem?.title}</td>
                                                                            <td style={{ maxWidth: '200px' }}>{elem?.description}</td>
                                                                            <td style={{ display: "flex", cursor: "pointer" }}>
                                                                                <>
                                                                                    <ReactTooltip id="delete-comm" />
                                                                                    <MdDelete data-tooltip-place="bottom"
                                                                                        data-tooltip-id="delete-comm"
                                                                                        data-tooltip-content="Delete"
                                                                                        size={20}
                                                                                        onClick={() => { onPressDeleteIcon(elem) }}
                                                                                    />
                                                                                </>
                                                                            </td>

                                                                        </tr>
                                                                    )
                                                                }
                                                                )
                                                                : <tr style={{ textAlign: 'center' }}><td colSpan={4}>Notification not found</td></tr>}
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
            </div >
        </>)
}

export default Notification