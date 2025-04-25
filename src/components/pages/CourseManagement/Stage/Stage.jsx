import { lazy, useEffect, useState } from "react"
import Header from "../../../layout/Header"
import Sidebar from "../../../layout/Sidebar"
import AddStage from "./AddStage"
import "./Stage.css"
import { getStageApi, manageStageApi, UpdateIndexingApi, deleteStageApi } from "../../../../services/stage"
import { displayErrorToast, displaySuccessToast } from "../../../../Utills/displayToasts"
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { MdDelete, MdEdit } from "react-icons/md"
import ReactPaginate from "react-paginate"
import { GrPrevious, GrNext } from "react-icons/gr";
import { getLoggedinUserProfile } from "../../../../services/profile"
import _ from "lodash";
import ImageModal from "../../../layout/ImageModal"
import Swal from "sweetalert2"
import { FaPlayCircle } from "react-icons/fa";
import SearchComponent from "../../../../component/Search/Search"
import { useLocation, useNavigate } from "react-router-dom"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IoIosInformationCircle } from "react-icons/io"

const numberPerPage = 10;

function Stage() {
    const location = useLocation()
    let { course } = location.state;

    if (!course) {
        course = JSON.parse(localStorage.getItem("course"))
    }

    const [openStage, setopenStage] = useState(false)
    const [loader, setLoader] = useState(true)
    const [Stage, setStage] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [selectedPage, setSelectedPage] = useState(1);
    const [mainArrayStage, setMainArrayStage] = useState({})
    const [imageModal, setImageModal] = useState(false);
    const [url, setUrl] = useState("");
    const [data, setData] = useState({})
    const [searchText, setSearchText] = useState("")
    const [originalOrder, setOriginalOrder] = useState([...Stage]);
    const [isOrderChanged, setIsOrderChanged] = useState(false);

    const navigate = useNavigate()

    const onClickAddStage = (data) => {
        setopenStage(data)
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
        const data = await getStageApi(paginateData, course._id)
        if (data?.success) {
            let paginateData = data?.data?.stages
            // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(data?.data?.totalPages)
            const mergeData = { [1]: paginateData }
            setMainArrayStage(mergeData)
            setStage(paginateData)
            setOriginalOrder([...paginateData]);
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getStageList2 = async (select, search) => {
        setLoader(true)
        const paginateData = {
            number: select || selectedPage,
            size: numberPerPage,
            search: search
        }
        const data = await getStageApi(paginateData, course._id)
        if (data?.success) {
            let paginateData = data?.data?.stages;
            // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(data?.data?.totalPages)
            const mergeData = { ...mainArrayStage, [select || selectedPage]: paginateData }
            setMainArrayStage(mergeData)
            setStage(paginateData)
            setOriginalOrder([...paginateData]);
        }
        else {
            displayErrorToast(data?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const getStageList = async (select) => {
        setLoader(true)
        if (!mainArrayStage[select || selectedPage]) {
            const paginateData = {
                number: select || selectedPage,
                size: numberPerPage,
                search: searchText,
            }
            const data = await getStageApi(paginateData, course._id)
            if (data?.success) {
                let paginateData = data?.data?.stages;
                // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTotalPage(data?.data?.totalPages)
                const mergeData = { ...mainArrayStage, [select || selectedPage]: paginateData }
                setMainArrayStage(mergeData)
                setStage(paginateData)
                setOriginalOrder([...paginateData]);
            }
            else {
                displayErrorToast(data?.message || "something went wrong while fetching data")
            }
            setLoader(false)
        }
        else {
            setStage(mainArrayStage[select || selectedPage])
        }
        setLoader(false)
    }

    useEffect(() => {
        setLoader(true)
        getStageList()
        getUserProfile()
    }, [])

    useEffect(() => {
        // Check if the order has changed and update isOrderChanged accordingly
        setIsOrderChanged(!originalOrder.every((item, index) => Stage[index] === item));
    }, [Stage, originalOrder]);

    const onPressDeleteIcon = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete ${data?.title}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const object = {};
                object.stageId = data?._id;

                await deleteStageApi(object).then(async (submit) => {
                    if (submit?.success) {
                        if (Stage.length === 1 && selectedPage > 1) {
                            setSelectedPage(selectedPage - 1)
                            await getStageList2(selectedPage - 1)
                        }
                        else {
                            await getStageList2()
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
        await getStageList(pageNo)
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
        onClickAddStage(true);
        setData(temp)
    }

    const onClickCloseIcon = async () => {
        setSelectedPage(1)
        setSearchText("")
        await getStageList2(1, "")
    }

    const onChangeSearchComponent = async (e) => {
        setSearchText(e?.target?.value?.trimStart())
        setSelectedPage(1)
        await getStageList2(1, e?.target?.value?.trimStart())
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(Stage);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setStage(items);
        setIsOrderChanged(true);
    };

    const handleUpdateOrder = async () => {
        // Implement the API call to update the order in the backend
        const data = {}
        data.courseId = course._id;
        data.stage_data = Stage.map((item, index) => {
            return {
                stageId: item._id,
                index: index + 1
            }
        }); // Add the order of each stage here
        const res = await UpdateIndexingApi(data);
        if (res?.success) {
            displaySuccessToast(res?.message || "Order updated successfully");
            setOriginalOrder([...Stage]);
            setIsOrderChanged(false);
        }
        else {
            displayErrorToast(res?.message || "something went wrong while updating order")
        }
    };

    return (
        <>
            <div data-sidebar="dark">
                {
                    openStage && <AddStage
                        appendDataInAdd={appendDataInAdd}
                        closeWrapper={onClickAddStage}
                        data={data}
                        id={course._id} />
                }
                <div id="layout-wrapper">
                    <Header />
                    <Sidebar />
                    {imageModal && <ImageModal
                        activeModal={imageModal}
                        setActiveModal={() => { setImageModal(false); setUrl(""); }}
                        img={url}
                        flag="Stage Image"
                    />}
                    <div className="main-content" style={{ minHeight: "100vh" }}>
                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                            <h4 className="mb-sm-0">Stage Management</h4>
                                            <div className="page-title-right">
                                                <ol className="breadcrumb m-0">
                                                    <li className="breadcrumb-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/course', {
                                                        state: { activePage: location?.state?.selectedPage }
                                                    })}><a>Course</a></li>
                                                    <li className="breadcrumb-item active">Stage Management</li>
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
                                                    <h4 className="card-title">List of Stage</h4>
                                                    <div className="d-flex flex-row">
                                                        <div style={{ marginRight: '10px' }}>
                                                            <SearchComponent
                                                                data={searchText}
                                                                onChange={(data) => onChangeSearchComponent(data)}
                                                                onClickCloseIcon={onClickCloseIcon} />
                                                        </div>
                                                        <div className="d-grid">
                                                            <button className="btn btn-primary waves-effect waves-light" type="buttom" onClick={() => onClickAddStage(true)} >Add Stage</button>
                                                        </div>
                                                        <div className="d-grid" style={{ marginLeft: '10px' }}>
                                                            <button className="btn btn-primary waves-effect waves-light" type="buttom" onClick={() => handleUpdateOrder()} disabled={!isOrderChanged} >Update Order</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ overflow: "auto" }}>
                                                    <DragDropContext onDragEnd={handleDragEnd}>
                                                        <Droppable droppableId="stages">
                                                            {(provided) => (
                                                                <table id="datatable" className="table table-bordered dt-responsive nowrap" style={{ borderCollapse: "collapse", borderSpacing: "0", width: "100%" }} {...provided.droppableProps} ref={provided.innerRef}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th style={{ maxWidth: "100px" }}>Image</th>
                                                                            <th>Title</th>
                                                                            <th>Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody ref={provided.innerRef} {...provided.droppableProps} >
                                                                        {loader ? <tr><td colSpan={4} className="text-center">Loading ...</td></tr> : Stage?.length > 0 ?
                                                                            Stage?.map((elem, index) => {
                                                                                return (
                                                                                    <Draggable key={elem?._id} draggableId={elem?._id.toString()} index={index}>
                                                                                        {(provided) => (
                                                                                            <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                                                <td>{(numberPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                                                                                <td style={{ maxWidth: "100px", alignContent: 'center', whiteSpace: 'normal' }}>{<div className="d-flex flex-row justify-content-center"><img loading={lazy} src={elem?.stageImage} style={{ height: "100px", width: "100px", objectFit: 'cover', overflow: 'hidden', cursor: "pointer" }} onClick={() => { handleImageModal(elem?.stageImage) }} /></div>}</td>
                                                                                                <td style={{ maxWidth: "250px", whiteSpace: 'normal' }}>{elem?.title}</td>
                                                                                                <td style={{ display: "flex", cursor: "pointer" }}>
                                                                                                    <>
                                                                                                        <ReactTooltip id="User-info" />
                                                                                                        <IoIosInformationCircle
                                                                                                            style={{ marginRight: "10px" }}
                                                                                                            data-tooltip-place="bottom"
                                                                                                            data-tooltip-id="User-info"
                                                                                                            data-tooltip-content="Meditation"
                                                                                                            size={20}
                                                                                                            onClick={() => {
                                                                                                                localStorage.setItem("course", JSON.stringify(course))
                                                                                                                navigate("/course-meditation", { state: { stage: elem, selectedPage } })
                                                                                                            }
                                                                                                            }
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
                                                                                        )}
                                                                                    </Draggable>
                                                                                )
                                                                            }
                                                                            )
                                                                            : <tr><td colSpan={4}>Stage not found</td></tr>}
                                                                        {provided.placeholder}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>
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
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>)
}

export default Stage;