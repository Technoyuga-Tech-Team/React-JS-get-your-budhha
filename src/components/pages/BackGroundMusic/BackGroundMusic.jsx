import { lazy, useEffect, useState } from "react"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import AddBackGroundMusic from "./AddBackGroundMusic"
import "./BackGroundMusic.css"
import { getBackGroundMusicApi, manageBackGroundMusic, deleteBackGroundMusic } from "../../../services/backGroundMusic"
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts"
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { MdDelete, MdEdit } from "react-icons/md"
import ReactPaginate from "react-paginate"
import { GrPrevious, GrNext } from "react-icons/gr";
import { getLoggedinUserProfile } from "../../../services/profile"
import _ from "lodash";
import ImageModal from "../../layout/ImageModal"
import { RxCross2 } from "react-icons/rx";
import Swal from "sweetalert2"
import SearchComponent from "../../../component/Search/Search"

function BackGroundMusic() {

    const [openBackGroundMusic, setopenBackGroundMusic] = useState(false)
    const [loader, setLoader] = useState(true)
    const [BackGroundMusic, setBackGroundMusic] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [selectedPage, setSelectedPage] = useState(1);
    const [mainArrayBackGroundMusic, setMainArrayBackGroundMusic] = useState({})
    const [imageModal, setImageModal] = useState(false);
    const [url, setUrl] = useState("");
    const [data, setData] = useState({})
    const [searchText, setSearchText] = useState("")
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const onClickAddBackGroundMusic = (data) => {
        setopenBackGroundMusic(data)
        setData({});
    }

    const appendDataInAdd = async () => {
        setLoader(true)
        setSelectedPage(1)
        const paginateData = {
            number: 1,
            size: recordsPerPage,
            search: searchText
        }
        const data = await getBackGroundMusicApi(paginateData)
        if (data?.success) {
            let paginateData = data?.data?.audioData
            setTotalPage(data?.data?.totalPages)
            const mergeData = { [1]: paginateData }
            setMainArrayBackGroundMusic(mergeData)
            setBackGroundMusic(paginateData)
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getBackGroundMusicList2 = async (select, size, search) => {
        setLoader(true)
        const paginateData = {
            number: select || selectedPage,
            size: size || recordsPerPage,
            search: search,
        }
        const data = await getBackGroundMusicApi(paginateData)
        if (data?.success) {
            let paginateData = data?.data?.audioData;
            setTotalPage(data?.data?.totalPages)
            const mergeData = { ...mainArrayBackGroundMusic, [select || selectedPage]: paginateData }
            setMainArrayBackGroundMusic(mergeData)
            setBackGroundMusic(paginateData)
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getBackGroundMusicList = async (select) => {
        setLoader(true)
        if (!mainArrayBackGroundMusic[select || selectedPage]) {
            const paginateData = {
                number: select || selectedPage,
                size: recordsPerPage,
                search: searchText,
            }
            const data = await getBackGroundMusicApi(paginateData)
            if (data?.success) {
                let paginateData = data?.data?.audioData;
                paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTotalPage(data?.data?.totalPages)
                const mergeData = { ...mainArrayBackGroundMusic, [select || selectedPage]: paginateData }
                setMainArrayBackGroundMusic(mergeData)
                setBackGroundMusic(paginateData)
            }
            else {
                displayErrorToast(data?.message || "something went wrong while fetching data")
            }
            setLoader(false)
        }
        else {
            setBackGroundMusic(mainArrayBackGroundMusic[select || selectedPage])
        }
        setLoader(false)
    }

    useEffect(() => {
        setLoader(true)
        getBackGroundMusicList()
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
                object.backGroundAudioId = data?._id;

                await deleteBackGroundMusic(object).then(async (submit) => {
                    if (submit?.success) {
                        if (BackGroundMusic.length === 1 && selectedPage > 1) {
                            setSelectedPage(selectedPage - 1)
                            await getBackGroundMusicList2(selectedPage - 1)

                        }
                        else {
                            // await getBackGroundMusicList()
                            await getBackGroundMusicList2()
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
        await getBackGroundMusicList(pageNo)
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
        onClickAddBackGroundMusic(true);
        setData(temp)
    }

    const onClickCloseIcon = async () => {
        setSelectedPage(1)
        setSearchText("")
        await getBackGroundMusicList(1, recordsPerPage, "")
    }

    const onChangeSearchComponent = async (e) => {
        setSearchText(e?.target?.value?.trimStart())
        setSelectedPage(1)
        await getBackGroundMusicList2(1, recordsPerPage, e?.target?.value?.trimStart())
    }

    const handleRecordsPerPageChange = async (value) => {
        const newRecordsPerPage = parseInt(value, 10);
        setRecordsPerPage(newRecordsPerPage);
        setSelectedPage(1); // Reset to the first page
        await getBackGroundMusicList2(1, parseInt(value, 10), searchText); // Fetch new data based on the new records per page
    };


    return (
        <>
            <div data-sidebar="dark">
                {
                    openBackGroundMusic && <AddBackGroundMusic
                        appendDataInAdd={appendDataInAdd}
                        closeWrapper={onClickAddBackGroundMusic}
                        data={data} />
                }
                <div id="layout-wrapper">
                    <Header />
                    <Sidebar />
                    {imageModal && <ImageModal
                        activeModal={imageModal}
                        setActiveModal={() => { setImageModal(false); setUrl(""); }}
                        img={url}
                        flag="BackGround Music Image"
                    />}
                    <div className="main-content" style={{ minHeight: "100vh" }}>
                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                            <h4 className="mb-sm-0">Background Music Management</h4>
                                            <div className="page-title-right">
                                                <ol className="breadcrumb m-0">
                                                    <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                                                    <li className="breadcrumb-item active">Background Music Management</li>
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
                                                    <h4 className="card-title">List of Background Music</h4>
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
                                                        <div>
                                                            <SearchComponent
                                                                data={searchText}
                                                                onChange={(data) => onChangeSearchComponent(data)}
                                                                onClickCloseIcon={onClickCloseIcon}
                                                            />
                                                        </div>
                                                        <div className="d-grid">
                                                            <button className="btn btn-primary waves-effect waves-light" type="buttom" style={{ height: '40px', marginLeft: '10px' }} onClick={() => onClickAddBackGroundMusic(true)} >Add Background Music</button>
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
                                                                <th>Backgroud Music</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loader ? <tr><td colSpan={4}>Loading ...</td></tr> : BackGroundMusic?.length > 0 ?
                                                                BackGroundMusic?.map((elem, index) => {
                                                                    return (
                                                                        <tr key={elem?._id}>
                                                                            <td>{(recordsPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                                                            <td style={{ maxWidth: "100px", alignContent: 'center', whiteSpace: 'normal' }}>{<div className="d-flex flex-row justify-content-center"><img loading={lazy} src={elem?.bgImage} style={{ height: "100px", width: "100px", objectFit: 'cover', overflow: 'hidden', cursor: "pointer" }} onClick={() => { handleImageModal(elem?.bgImage) }} /></div>}</td>
                                                                            <td>{elem?.name}</td>
                                                                            <td style={{ maxWidth: "200px", alignContent: 'center', whiteSpace: 'normal' }}>
                                                                                <div className="d-flex flex-row justify-content-center">
                                                                                    <audio controls>
                                                                                        <source src={elem?.audio} type="audio/ogg" />
                                                                                        <source src={elem?.audio} type="audio/mpeg" />
                                                                                    </audio>
                                                                                </div>
                                                                            </td>
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
                                                                : <tr><td colSpan={4}>Background Music not found</td></tr>}
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

export default BackGroundMusic