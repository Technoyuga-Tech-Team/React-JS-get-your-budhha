import { lazy, useEffect, useState } from "react"
import Header from "../../../layout/Header"
import Sidebar from "../../../layout/Sidebar"
import AddCourse from "./AddCourse"
import "./Course.css"
import { getCourseApi, deleteCourseApi } from "../../../../services/course"
import { displayErrorToast, displaySuccessToast } from "../../../../Utills/displayToasts"
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { MdDelete, MdEdit, MdFeedback } from "react-icons/md"
import ReactPaginate from "react-paginate"
import { GrPrevious, GrNext } from "react-icons/gr";
import { getLoggedinUserProfile } from "../../../../services/profile"
import _ from "lodash";
import ImageModal from "../../../layout/ImageModal"
import Swal from "sweetalert2"
import { FaPlayCircle } from "react-icons/fa";
import SearchComponent from "../../../../component/Search/Search"
import { IoIosInformationCircle } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom"

const numberPerPage = 10;

function Course() {

    const [openCourse, setopenCourse] = useState(false)
    const [loader, setLoader] = useState(true)
    const [Course, setCourse] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [selectedPage, setSelectedPage] = useState(1);
    const [mainArrayCourse, setMainArrayCourse] = useState({})
    const [imageModal, setImageModal] = useState(false);
    const [url, setUrl] = useState("");
    const [data, setData] = useState({})
    const [searchText, setSearchText] = useState("")

    const navigate = useNavigate()
    const location = useLocation()

    const onClickAddCourse = (data) => {
        setopenCourse(data)
        setData({});
    }

    const appendDataInAdd = async () => {
        setLoader(true)
        setSelectedPage(1)
        const paginateData = {
            number: 1,
            size: numberPerPage,
            search: searchText,
        }
        const data = await getCourseApi(paginateData)
        if (data?.success) {
            let paginateData = data?.data?.courses
            // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(data?.data?.totalPages)
            const mergeData = { [1]: paginateData }
            setMainArrayCourse(mergeData)
            setCourse(paginateData)
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getCourseList2 = async (select, search) => {
        setLoader(true)
        const paginateData = {
            number: select || selectedPage,
            size: numberPerPage,
            search: search
        }
        const data = await getCourseApi(paginateData)
        if (data?.success) {
            let paginateData = data?.data?.courses;
            // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(data?.data?.totalPages)
            const mergeData = { ...mainArrayCourse, [select || selectedPage]: paginateData }
            setMainArrayCourse(mergeData)
            setCourse(paginateData)
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getCourseList = async (select) => {
        setLoader(true)
        if (!mainArrayCourse[select || selectedPage]) {
            const paginateData = {
                number: select || selectedPage,
                size: numberPerPage,
                search: searchText,
            }
            const data = await getCourseApi(paginateData)
            if (data?.success) {
                let paginateData = data?.data?.courses;
                // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTotalPage(data?.data?.totalPages)
                const mergeData = { ...mainArrayCourse, [select || selectedPage]: paginateData }
                setMainArrayCourse(mergeData)
                setCourse(paginateData)
            }
            else {
                displayErrorToast(data?.message || "something went wrong while fetching data")
            }
            setLoader(false)
        }
        else {
            setCourse(mainArrayCourse[select || selectedPage])
        }
        setLoader(false)
    }

    const clearAllStateData = () => {
        setSelectedPage(1)
        setSearchText("")
    }

    useEffect(() => {
        setLoader(true)
        if (location?.state?.activePage) {
            setSelectedPage(location?.state?.activePage)
            getCourseList(location?.state?.activePage)

        } else {
            getCourseList(1)
            clearAllStateData()
        }
        getUserProfile()
    }, [])

    const onPressDeleteIcon = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete ${data?.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const object = {};
                object.courseId = data?._id;

                await deleteCourseApi(object).then(async (submit) => {
                    if (submit?.success) {
                        if (Course.length === 1 && selectedPage > 1) {
                            setSelectedPage(selectedPage - 1)
                            await getCourseList2(selectedPage - 1)
                        }
                        else {
                            await getCourseList2()
                        }
                        displaySuccessToast("Deleted successfully")
                    }
                    else {
                        displayErrorToast(submit?.message || "something went wrong while adding data")
                    }
                });
            }
        })
    }

    const handlePageClick = async (data) => {
        setLoader(true)
        const pageNo = data.selected + 1;
        await getCourseList(pageNo)
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

    const handleImageModal = (img) => {
        setImageModal(true);
        setUrl(img)
    }

    const handleEdit = (temp) => {
        onClickAddCourse(true);
        setData(temp)
    }

    const onClickCloseIcon = async () => {
        setSelectedPage(1)
        setSearchText("")
        await getCourseList2(1, "")
    }

    const onChangeSearchComponent = async (e) => {
        setSearchText(e?.target?.value?.trimStart())
        setSelectedPage(1)
        await getCourseList2(1, e?.target?.value?.trimStart())
    }

    return (
        <>
            <div data-sidebar="dark">
                {
                    openCourse && <AddCourse
                        appendDataInAdd={appendDataInAdd}
                        closeWrapper={onClickAddCourse}
                        data={data} />
                }
                <div id="layout-wrapper">
                    <Header />
                    <Sidebar />
                    {imageModal && <ImageModal
                        activeModal={imageModal}
                        setActiveModal={() => { setImageModal(false); setUrl(""); }}
                        img={url}
                        flag="Course Image"
                    />}
                    <div className="main-content" style={{ minHeight: "100vh" }}>
                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                            <h4 className="mb-sm-0">Course Management</h4>
                                            <div className="page-title-right">
                                                <ol className="breadcrumb m-0">
                                                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                                                    <li className="breadcrumb-item active">Course Management</li>
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
                                                    <h4 className="card-title">List of Course</h4>
                                                    <div className="d-flex flex-row">
                                                        <div style={{ marginRight: '10px' }}>
                                                            <SearchComponent
                                                                data={searchText}
                                                                onChange={(data) => onChangeSearchComponent(data)}
                                                                onClickCloseIcon={onClickCloseIcon} />
                                                        </div>
                                                        <div className="d-grid">
                                                            <button className="btn btn-primary waves-effect waves-light" type="buttom" onClick={() => onClickAddCourse(true)} >Add Course</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ overflow: "auto" }}>
                                                    <table id="datatable" className="table table-bordered dt-responsive nowrap" style={{ borderCollapse: "collapse", borderSpacing: "0", width: "100%" }}>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th style={{ maxWidth: "100px" }}>Image</th>
                                                                <th>Name</th>
                                                                <th style={{ maxWidth: "100px" }}>Description</th>
                                                                <th>Type</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loader ? <tr><td colSpan={6}>Loading ...</td></tr> : Course?.length > 0 ?
                                                                Course?.map((elem, index) => {
                                                                    return (
                                                                        <tr key={elem?._id}>
                                                                            <td>{(numberPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                                                            <td style={{ maxWidth: "100px", alignContent: 'center', whiteSpace: 'normal' }}>{<div className="d-flex flex-row justify-content-center"><img loading={lazy} src={elem?.courseImage} style={{ height: "100px", width: "100px", objectFit: 'cover', overflow: 'hidden', cursor: "pointer" }} onClick={() => { handleImageModal(elem?.courseImage) }} /></div>}</td>
                                                                            <td>{elem?.name}</td>
                                                                            <td style={{ maxWidth: "100px" }}>{elem?.description}</td>
                                                                            <td>{elem?.is_free ? "Free" : "Paid"}</td>
                                                                            <td style={{ display: "flex", cursor: "pointer" }}>
                                                                                <>
                                                                                    <ReactTooltip id="User-info" />
                                                                                    <IoIosInformationCircle
                                                                                        style={{ marginRight: "10px" }}
                                                                                        data-tooltip-place="bottom"
                                                                                        data-tooltip-id="User-info"
                                                                                        data-tooltip-content="Stage"
                                                                                        size={20}
                                                                                        onClick={() => navigate("/stage", { state: { course: elem, selectedPage } })}
                                                                                    />
                                                                                </>
                                                                                <>
                                                                                    <ReactTooltip id="edit-comm" />
                                                                                    <MdEdit
                                                                                        data-tooltip-place="bottom"
                                                                                        data-tooltip-id="edit-comm"
                                                                                        data-tooltip-content="Edit"
                                                                                        style={{ marginRight: "10px" }}
                                                                                        onClick={() => handleEdit(elem)}
                                                                                        size={20}
                                                                                    />
                                                                                </>
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
                                                                : <tr><td colSpan={6}>Course not found</td></tr>}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>)
}

export default Course