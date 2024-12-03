import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrPrevious, GrNext } from "react-icons/gr";
import ReactPaginate from "react-paginate";
import { getFeedbackApi, updateFeedbackApi } from "../../../services/feedback"
import SearchComponent from "../../../component/Search/Search";
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts";
import { TiTick } from "react-icons/ti";

const numberPerPage = 10;

function ViewFeedback() {
    const location = useLocation()

    // const { data, type, stage } = location.state
    const [loader, setLoader] = useState(true)
    const [selectedPage, setSelectedPage] = useState(1);
    const [Feedback, setFeedback] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [searchText, setSearchText] = useState("")
    const [mainArrayFeedback, setMainArrayFeedback] = useState({})

    const navigate = useNavigate()

    const getFeedbackList = async (select, search) => {
        setLoader(true)
        const paginateData = {
            number: select || selectedPage,
            size: numberPerPage,
            search: search,
        }
        const res = await getFeedbackApi(paginateData)
        if (res?.success) {
            let paginateData = res?.data?.feedbacks;
            paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTotalPage(res?.data?.totalPages)
            const mergeData = { ...mainArrayFeedback, [select || selectedPage]: paginateData }
            setMainArrayFeedback(mergeData)
            setFeedback(paginateData)
        }
        else {
            displayErrorToast(res?.message || "something went wrong while fetching data")
        }
        setLoader(false)
    }

    const onClickCloseIcon = async () => {
        setSelectedPage(1)
        setSearchText("")
        await getFeedbackList(1, "")
    }

    const onChangeSearchComponent = async (e) => {
        setSearchText(e?.target?.value)
        setSelectedPage(1)
        await getFeedbackList(1, e?.target?.value)
    }

    useEffect(() => {
        getFeedbackList()
    }, [])

    const handlePageClick = async (data) => {
        setLoader(true)
        const pageNo = data.selected + 1;
        await getFeedbackList(pageNo)
        setSelectedPage(pageNo);
    };

    const updateFeedback = async (id) => {
        const res = await updateFeedbackApi({ feedbackId: id })
        if (res?.success) {
            displaySuccessToast("Feedback resolved successfully")
            const updatedFeedback = Feedback.map((item) => {
                if (item._id === id) {
                    return { ...item, markAsRead: true };
                }
                return item;
            });

            const updatedMainArrayFeedback = { ...mainArrayFeedback, [selectedPage]: updatedFeedback };

            setFeedback(updatedFeedback);
            setMainArrayFeedback(updatedMainArrayFeedback);
        }
        else {
            displayErrorToast(res?.message || "Something went wrong while resolving feedback")
        }
    }

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
                                                    <li className="breadcrumb-item" style={{ cursor: 'pointer' }} onClick={() => {
                                                        navigate('/dashboard')
                                                    }}><a>Dashboard</a></li>
                                                    <li className="breadcrumb-item active">Feedback List</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div
                                    style={{
                                        backgroundColor: "white",
                                        padding: "20px",
                                        borderRadius: "20px",
                                        marginTop: "10px",
                                    }}
                                > */}
                                    {/* <div className="row RestName" style={{ borderRadius: "20px" }}>
                                        <div className="mx-auto ">
                                            <span style={{ fontSize: "18px", fontWeight: "700" }}>
                                                <IoMdArrowRoundBack style={{ cursor: "pointer" }} onClick={() => onClickBackBtn()} /> Feedback of {data.meditationName}
                                            </span>
                                            <i className="fa fa-edit ml-2" onClick={()=>{navigate("/edit-guru-details", {state: data,})}}></i>
                                        </div>
                                    </div>
                                    <br /> */}
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
                                                        </div>
                                                    </div>
                                                    <div style={{ overflow: "auto" }}>
                                                        <table id="datatable" className="table table-bordered dt-responsive nowrap" style={{ borderCollapse: "collapse", borderSpacing: "0", width: "100%" }}>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Name</th>
                                                                    <th>Review</th>
                                                                    <th>Rating</th>
                                                                    <th>Helped Become</th>
                                                                    <th>Like About Application</th>
                                                                    <th>Improve Application</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {loader ? <tr><td colSpan={4}>Loading ...</td></tr> : Feedback?.length > 0 ?
                                                                    Feedback?.map((elem, index) => {
                                                                        return (
                                                                            <tr key={elem?._id}>
                                                                                <td>{(numberPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                                                                <td>{elem?.user?.firstName + " " + elem?.user?.lastName}</td>
                                                                                <td>{elem?.review ? elem?.review : "-"}</td>
                                                                                <td>{elem?.rating}</td>
                                                                                <td>{elem?.helpedBecome ? elem?.helpedBecome : "-"}</td>
                                                                                <td>{elem?.likeAboutMeditation ? elem?.likeAboutMeditation : "-"}</td>
                                                                                <td>{elem?.improveMeditation ? elem?.improveMeditation : "-"}</td>
                                                                                <td>{elem?.improveMeditation ? elem?.markAsRead ?
                                                                                    <button type="button" disabled className="btn btn-success d-flex flex-row">Resolved <TiTick fontSize={20} style={{ marginLeft: '2px' }} /> </button>
                                                                                    : <button type="button" style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd', color: 'white' }} className="btn" onClick={() => { updateFeedback(elem?._id) }}>Resolve</button>
                                                                                    : "-"
                                                                                }</td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                    )
                                                                    : <tr><td colSpan={7}>Feedback not found</td></tr>}
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
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ViewFeedback