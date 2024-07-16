import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrPrevious, GrNext } from "react-icons/gr";
import ReactPaginate from "react-paginate";
import { getFeedbackApi } from "../../../services/feedback"
import SearchComponent from "../../../component/Search/Search";
const numberPerPage = 10;

function ViewFeedback() {
    const location = useLocation()

    const { data } = location.state
    const [loader, setLoader] = useState(true)
    const [selectedPage, setSelectedPage] = useState(1);
    const [Feedback, setFeedback] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [searchText, setSearchText] = useState("")
    const [mainArrayFeedback, setMainArrayFeedback] = useState({})

    console.log("==============", data)
    const navigate = useNavigate()
    const onClickBackBtn = () => {
        navigate('/meditation', {
            state: { activePage: location?.state?.selectedPage }
        })
    }

    const getFeedbackList = async (select, search) => {
        setLoader(true)
        const paginateData = {
            number: select || selectedPage,
            size: numberPerPage,
            search: search,
        }
        const data = await getFeedbackApi(paginateData)
        if (data?.success) {
            let paginateData = data?.data?.updateResult;
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

    const onClickCloseIcon = async () => {
        setSelectedPage(1)
        setSearchText("")
        await getFeedbackList(1, "")
    }

    useEffect(() => {
        
    }, [])

    const handlePageClick = async (data) => {
        setLoader(true)
        const pageNo = data.selected + 1;
        await getFeedbackList(pageNo)
        setSelectedPage(pageNo);
    };

    return (
        <>
            <div data-sidebar="dark">
                <div id="layout-wrapper">
                    <Header />
                    <Sidebar />
                    <div className="main-content">
                        <div className="page-content" style={{ minHeight: "100vh" }}>
                            <div className="container-fluid">
                                {/* start page title */}
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                            <h4 className="mb-sm-0">Feedback List</h4>
                                            <div className="page-title-right">
                                                <ol className="breadcrumb m-0">
                                                    <li className="breadcrumb-item" style={{cursor:'pointer'}} onClick={ () => navigate('/meditation', {
                                                        state: { activePage: location?.state?.selectedPage }
                                                    })}><a>Meditation Management</a></li>
                                                    <li className="breadcrumb-item active">Feedback List</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: "white",
                                        padding: "20px",
                                        borderRadius: "20px",
                                        marginTop: "10px",
                                    }}
                                >
                                    <div className="row RestName" style={{ borderRadius: "20px" }}>
                                        <div className="mx-auto ">
                                            <span style={{ fontSize: "18px", fontWeight: "700" }}>
                                                <IoMdArrowRoundBack style={{ cursor: "pointer" }} onClick={() => onClickBackBtn()} /> Feedback of {data.meditationName}
                                            </span>
                                            {/* <i className="fa fa-edit ml-2" onClick={()=>{navigate("/edit-guru-details", {state: data,})}}></i> */}
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "15px" }}>
                                                    <h4 className="card-title">List of Feedback</h4>
                                                    <div className="d-flex flex-row">
                                                        <div style={{ marginTop: '28px', marginLeft: '10px' }}>
                                                            <SearchComponent
                                                                data={searchText}
                                                                onChange={(data) => onChangeSearchComponent(data)}
                                                                onClickCloseIcon={onClickCloseIcon} />
                                                        </div>
                                                        <div className="d-grid">
                                                            <button className="btn btn-primary waves-effect waves-light" type="buttom" style={{ height: '40px', marginTop: '27px', marginLeft: '10px' }} onClick={() => onClickAddFeedback(true)} >Add Feedback</button>
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
                                                                <th>Moods</th>
                                                                <th>Theme</th>
                                                                <th>Rating</th>
                                                                <th>Female Audio</th>
                                                                <th>Male Audio</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loader ? <tr><td colSpan={4}>Loading ...</td></tr> : Feedback?.length > 0 ?
                                                                Feedback?.map((elem, index) => {
                                                                    return (
                                                                        <tr key={elem?._id}>
                                                                            <td>{(numberPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                                                            <td style={{ maxWidth: "100px", alignContent: 'center', whiteSpace: 'normal' }}>{<div className="d-flex flex-row justify-content-center"><img loading="lazy" src={elem?.FeedbackImage} style={{ height: "100px", width: "100px", objectFit: 'cover', overflow: 'hidden', cursor: "pointer" }} onClick={() => { handleImageModal(elem?.FeedbackImage) }} /></div>}</td>
                                                                            <td>{elem?.FeedbackName}</td>
                                                                            <td style={{ maxWidth: "100px" }}>{elem?.description}</td>
                                                                            <td>{elem?.moods.map(mood => mood.name).join(", ")}</td>
                                                                            <td>{elem?.theme?.name}</td>
                                                                            <td className="d-flex flex-row justify-content-center">{elem?.overallRating}</td>
                                                                            <td>
                                                                                <div className="d-flex flex-row justify-content-center">
                                                                                    <FaPlayCircle color="black" size={20} style={{ cursor: 'pointer', marginRight: '5px', marginTop: '3px' }} onClick={() => { handleAudioModal(elem?.femaleAudio) }} />
                                                                                    <p style={{ fontSize: '18px' }}>Play</p>
                                                                                    {/* <button style={{borderRadius:'50px'}} type="button" class="btn btn-primary" onClick={() => { handleAudioModal(elem?.femaleAudio) }}>Play</button> */}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="d-flex flex-row justify-content-center">
                                                                                    <FaPlayCircle color="black" size={20} style={{ cursor: 'pointer', marginRight: '5px', marginTop: '3px' }} onClick={() => { handleAudioModal(elem?.maleAudio) }} />
                                                                                    <p style={{ fontSize: '18px' }}>Play</p>
                                                                                    {/* <button style={{borderRadius:'50px'}} type="button" class="btn btn-primary" onClick={() => { handleAudioModal(elem?.maleAudio) }}>Play</button> */}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                }
                                                                )
                                                                : <tr><td colSpan={4}>Feedback not found</td></tr>}
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
                </div>
            </div >
        </>
    )
}

export default ViewFeedback