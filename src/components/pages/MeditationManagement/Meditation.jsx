import { useEffect, useState } from "react"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import AddMeditation from "./AddMeditation"
import "./Meditation.css"
import { getmoodApi, managemood } from "../../../services/mood"
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts"
import { TiTick } from "react-icons/ti";
import { TiTimes } from "react-icons/ti";
// import { numberPerPage, userRoleTypeForSuper } from "../../../constant/constanant"
import { useSelector } from "react-redux"
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

const numberPerPage = 10;

function Meditation() {

    const [openMeditation, setopenMeditation] = useState(false)
    const [loader, setLoader] = useState(true)
    const [Meditation, setMeditation] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [selectedPage, setSelectedPage] = useState(1);
    const [mainArrayMeditation, setMainArrayMeditation] = useState({})
    const [imageModal, setImageModal] = useState(false);
    const [url, setUrl] = useState("");
    const [data, setData] = useState({})
    const [searchText, setSearchText] = useState("")

    const onClickAddMeditation = (data) => {
        setopenMeditation(data)
        setData({});
    }

    const appendDataInAdd = async () => {
        setLoader(true)
        setSelectedPage(1)
        const paginateData = {
            number: 1,
            size: numberPerPage,
            search: searchText
        }
        const data = await getmoodApi(paginateData)
        if (data?.success) {
            let paginateData = data?.data?.Meditations
            paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(data?.data?.totalPages)
            const mergeData = { [1]: paginateData }
            setMainArrayMeditation(mergeData)
            setMeditation(paginateData)
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getMeditationList2 = async (select) => {
        setLoader(true)
        const paginateData = {
            number: select || selectedPage,
            size: numberPerPage,
            search: searchText
        }
        const data = await getmoodApi(paginateData)
        if (data?.success) {
            let paginateData = data?.data?.Meditations;
            paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(data?.data?.totalPages)
            const mergeData = { ...mainArrayMeditation, [select || selectedPage]: paginateData }
            setMainArrayMeditation(mergeData)
            setMeditation(paginateData)
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getMeditationList = async (select) => {
        setLoader(true)
        if (!mainArrayMeditation[select || selectedPage]) {
            const paginateData = {
                number: select || selectedPage,
                size: numberPerPage,
                search: searchText
            }
            const data = await getmoodApi(paginateData)
            if (data?.success) {
                let paginateData = data?.data?.Meditations;
                paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTotalPage(data?.data?.totalPages)
                const mergeData = { ...mainArrayMeditation, [select || selectedPage]: paginateData }
                setMainArrayMeditation(mergeData)
                setMeditation(paginateData)
            }
            else {
                displayErrorToast(data?.message || "something went wrong while fetching data")
            }
            setLoader(false)
        }
        else {
            setMeditation(mainArrayMeditation[select || selectedPage])
        }
        setLoader(false)
    }

    useEffect(() => {
        setLoader(true)
        getMeditationList()
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
                const object = new FormData();
                object.append("MeditationId", data?._id);
                object.append("deleteMeditation", "delete");

                await managemood(object).then(async (submit) => {
                    if (submit?.success) {
                        if (Meditation.length === 1 && selectedPage > 1) {
                            setSelectedPage(selectedPage - 1)
                            await getMeditationList(selectedPage - 1)

                        }
                        else {
                            // await getMeditationList()
                            await getMeditationList2()
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
        await getMeditationList(pageNo)
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
        onClickAddMeditation(true);
        setData(temp)
    }

    const onClickCloseIcon = async () => {
        setSelectedPage(1)
        setSearchText("")
        await getMeditationList(1)
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            setSelectedPage(1)
            await getMeditationList2(1)
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [searchText])

    return (
        <>
            <div data-sidebar="dark">
                {
                    openMeditation && <AddMeditation
                        appendDataInAdd={appendDataInAdd}
                        closeWrapper={onClickAddMeditation}
                        data={data} />
                }
                <div id="layout-wrapper">
                    <Header />
                    <Sidebar />
                    <ImageModal
                        activeModal={imageModal}
                        setActiveModal={() => { setImageModal(false); setUrl(""); }}
                        img={url}
                        flag="Meditation Image"
                    />
                    <div className="main-content" style={{ minHeight: "100vh" }}>
                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                            <h4 className="mb-sm-0">Meditation Management</h4>
                                            <div className="page-title-right">
                                                <ol className="breadcrumb m-0">
                                                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                                                    <li className="breadcrumb-item active">Meditation Management</li>
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
                                                    <h4 className="card-title">List of Meditation</h4>
                                                    <div className="d-flex flex-row">
                                                        <div class="wrap-input-18">
                                                            <div class="search">
                                                                <div>
                                                                    <input type="text" value={searchText} onChange={(e) => { setSearchText(e.target.value.trimStart()) }} placeholder="Search . . ." />
                                                                    {searchText?.length > 0 && <RxCross2 className="input-with-icon-design" color="grey" onClick={onClickCloseIcon} />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-grid">
                                                            <button className="btn btn-primary waves-effect waves-light" type="buttom" style={{ height: '40px', marginTop: '15px' }} onClick={() => onClickAddMeditation(true)} >Add Meditation</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ overflow: "auto" }}>
                                                    <table id="datatable" className="table table-bordered dt-responsive nowrap" style={{ borderCollapse: "collapse", borderSpacing: "0", width: "100%" }}>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Name</th>
                                                                <th style={{ maxWidth: "100px" }}>Image</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loader ? <tr><td colSpan={4}>Loading ...</td></tr> : Meditation?.length > 0 ?
                                                                Meditation?.map((elem, index) => {
                                                                    return (
                                                                        <tr key={elem?._id}>
                                                                            <td>{(numberPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                                                            <td>{elem?.name}</td>
                                                                            <td style={{ maxWidth: "100px", alignContent: 'center', whiteSpace: 'normal' }}>{<div className="d-flex flex-row justify-content-center"><img src={elem?.image} style={{ height: "100px", width: "100px", objectFit: 'cover', overflow: 'hidden', cursor: "pointer" }} onClick={() => { handleImageModal(elem?.image) }} /></div>}</td>
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
                                                                : <tr><td colSpan={4}>Meditation not found</td></tr>}
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

export default Meditation