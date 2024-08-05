import { useEffect, useState } from "react"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import AddMood from "./AddMood"
import "./Mood.css"
import { getmoodApi, deletemood } from "../../../services/mood"
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts"
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { MdDelete, MdEdit } from "react-icons/md"
import ReactPaginate from "react-paginate"
import { GrPrevious, GrNext } from "react-icons/gr";
import { getLoggedinUserProfile } from "../../../services/profile"
import _ from "lodash";
import ImageModal from "../../layout/ImageModal"
import { RxCross2 } from "react-icons/rx";
const PIE_API_URL = import.meta.env.VITE_REACT_IMAGE_URL;
import Swal from "sweetalert2"
import SearchComponent from "../../../component/Search/Search"
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/io"
// import Select from "react-select";

// const recordsPerPage = 10;

function Mood() {

    const [openMood, setopenMood] = useState(false)
    const [loader, setLoader] = useState(true)
    const [Mood, setMood] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [selectedPage, setSelectedPage] = useState(1);
    const [mainArrayMood, setMainArrayMood] = useState({})
    const [imageModal, setImageModal] = useState(false);
    const [url, setUrl] = useState("");
    const [data, setData] = useState({})
    const [searchText, setSearchText] = useState("")
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [sortField, setSortField] = useState('name'); // Default sort field
    const [sortOrder, setSortOrder] = useState(1); // Default sort order: 1 for ascending, -1 for descending

    const onClickAddMood = (data) => {
        setopenMood(data)
        setData({});
    }

    const appendDataInAdd = async () => {
        setLoader(true)
        setSelectedPage(1)
        const paginateData = {
            number: 1,
            size: recordsPerPage,
            search: searchText,
            sortOrder,
            sortBy: sortField
        }
        const data = await getmoodApi(paginateData)
        if (data?.success) {
            let paginateData = data?.data?.moods
            // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(data?.data?.totalPages)
            const mergeData = { [1]: paginateData }
            setMainArrayMood(mergeData)
            setMood(paginateData)
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getMoodList2 = async (select, size, search) => {
        setLoader(true)
        const paginateData = {
            number: select,
            size: size,
            search: search,
            sortOrder,
            sortBy: sortField
        }
        const data = await getmoodApi(paginateData)
        console.log(data?.data?.moods)
        if (data?.success) {
            let paginateData = data?.data?.moods;
            // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(data?.data?.totalPages)
            const mergeData = { ...mainArrayMood, [select || selectedPage]: paginateData }
            setMainArrayMood(mergeData)
            setMood(paginateData)
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getMoodList = async (select) => {
        setLoader(true)
        if (!mainArrayMood[select || selectedPage]) {
            const paginateData = {
                number: select || selectedPage,
                size: recordsPerPage,
                search: searchText,
                sortOrder,
                sortBy: sortField
            }
            const data = await getmoodApi(paginateData)
            if (data?.success) {
                let paginateData = data?.data?.moods;
                // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTotalPage(data?.data?.totalPages)
                const mergeData = { ...mainArrayMood, [select || selectedPage]: paginateData }
                setMainArrayMood(mergeData)
                setMood(paginateData)
            }
            else {
                displayErrorToast(data?.message || "something went wrong while fetching data")
            }
            setLoader(false)
        }
        else {
            setMood(mainArrayMood[select || selectedPage])
        }
        setLoader(false)
    }

    useEffect(() => {
        setLoader(true)
        getMoodList()
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
                object.moodId = data?._id;

                await deletemood(object).then(async (submit) => {
                    if (submit?.success) {
                        if (Mood.length === 1 && selectedPage > 1) {
                            setSelectedPage(selectedPage - 1)
                            await getMoodList2(selectedPage - 1)

                        }
                        else {
                            // await getMoodList()
                            await getMoodList2(selectedPage)
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
        await getMoodList(pageNo)
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
        onClickAddMood(true);
        setData(temp)
    }

    const onClickCloseIcon = async () => {
        setSelectedPage(1)
        setSearchText("")
        await getMoodList2(1, recordsPerPage, "")
    }

    const onChangeSearchComponent = async (e) => {
        setSearchText(e?.target?.value)
        setSelectedPage(1)
        await getMoodList2(1, recordsPerPage, e?.target?.value)
    }

    const handleRecordsPerPageChange = async (value) => {
        const newRecordsPerPage = parseInt(value, 10);
        setRecordsPerPage(newRecordsPerPage);
        setSelectedPage(1); // Reset to the first page
        await getMoodList2(1, parseInt(value, 10), searchText); // Fetch new data based on the new records per page
    };

    const handleSort = async (field) => {
        const newSortOrder = (sortField === field && sortOrder === 1) ? -1 : 1;
        setSortField(field);
        setSortOrder(newSortOrder);
        await getMoodList2(selectedPage, recordsPerPage, searchText);
    };


    return (
        <>
            <div data-sidebar="dark">
                {
                    openMood && <AddMood
                        appendDataInAdd={appendDataInAdd}
                        closeWrapper={onClickAddMood}
                        data={data} />
                }
                <div id="layout-wrapper">
                    <Header />
                    <Sidebar />
                    <ImageModal
                        activeModal={imageModal}
                        setActiveModal={() => { setImageModal(false); setUrl(""); }}
                        img={url}
                        flag="Mood Image"
                    />
                    <div className="main-content" style={{ minHeight: "100vh" }}>
                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                            <h4 className="mb-sm-0">Mood Management</h4>
                                            <div className="page-title-right">
                                                <ol className="breadcrumb m-0">
                                                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                                                    <li className="breadcrumb-item active">Mood Management</li>
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
                                                    <h4 className="card-title">List of Mood</h4>
                                                    <div className="d-flex flex-row">
                                                        <SearchComponent
                                                            data={searchText}
                                                            onChange={(data) => onChangeSearchComponent(data)}
                                                            onClickCloseIcon={onClickCloseIcon} />
                                                        <div className="d-grid">
                                                            <button className="btn btn-primary waves-effect waves-light" type="buttom" style={{ height: '40px', marginLeft: '10px' }} onClick={() => onClickAddMood(true)} >Add Mood</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ overflow: "auto" }}>
                                                    <table id="datatable" className="table table-bordered dt-responsive nowrap" style={{ borderCollapse: "collapse", borderSpacing: "0", width: "100%" }}>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th onClick={() => handleSort('name')} style={{ cursor: "pointer" }}>
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        Name {sortField === 'name' && (sortOrder === 1 ? <IoMdArrowRoundUp fontSize={20} /> : <IoMdArrowRoundDown fontSize={20} />)}
                                                                    </div>
                                                                </th>
                                                                <th style={{ maxWidth: "100px" }}>Image</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loader ? <tr><td colSpan={4}>Loading ...</td></tr> : Mood?.length > 0 ?
                                                                Mood?.map((elem, index) => {
                                                                    return (
                                                                        <tr key={elem?._id}>
                                                                            <td>{(recordsPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                                                            <td>{elem?.name}</td>
                                                                            <td style={{ maxWidth: "100px", alignContent: 'center', whiteSpace: 'normal' }}>{<div className="d-flex flex-row justify-content-center"><img loading="lazy" src={elem?.image} style={{ height: "100px", width: "100px", objectFit: 'cover', overflow: 'hidden', cursor: "pointer" }} onClick={() => { handleImageModal(elem?.image) }} /></div>}</td>
                                                                            <td style={{ display: "flex", cursor: "pointer" }}>
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
                                                                : <tr><td colSpan={4}>Mood not found</td></tr>}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div style={{ justifyContent: "center", width: "100%", alignItems: "center", display: "flex" }}>
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
                                <div className="d-grid">
                                    <select
                                        className="form-select"
                                        value={recordsPerPage}
                                        onChange={(e) => handleRecordsPerPageChange(e.target.value)}
                                        style={{ height: '40px', marginLeft: '10px' }}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div> */}
                                <div className="pagination-container">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>)
}

export default Mood