import { useEffect, useState } from "react"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import AddMeditation from "./AddMeditation"
import "./Meditation.css"
import { deleteMeditation, getMeditationApi, manageMenidation } from "../../../services/meditation"
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts"
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { MdDelete, MdEdit } from "react-icons/md"
import ReactPaginate from "react-paginate"
import { GrPrevious, GrNext } from "react-icons/gr";
import { getLoggedinUserProfile } from "../../../services/profile"
import _ from "lodash";
import ImageModal from "../../layout/ImageModal"
import Swal from "sweetalert2"
import AudioModal from "../../layout/AudioModal"
import DropdownComponent from "../../../component/DropDown/Dropdown"
import { getthemeApi } from "../../../services/theme"
// import { getmoodApi } from "../../../services/mood"
import { FaPlayCircle } from "react-icons/fa";
import SearchComponent from "../../../component/Search/Search"
import { MdFeedback } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom"

// const numberPerPage = 10;

function Meditation() {

    const [openMeditation, setopenMeditation] = useState(false)
    const [loader, setLoader] = useState(true)
    const [Meditation, setMeditation] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [selectedPage, setSelectedPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [mainArrayMeditation, setMainArrayMeditation] = useState({})
    const [imageModal, setImageModal] = useState(false);
    const [audioModal, setAudioModal] = useState(false);
    const [url, setUrl] = useState("");
    const [data, setData] = useState({})
    const [searchText, setSearchText] = useState("")
    const [themeDropDown, setThemeDropDown] = useState([]);
    const [moodDropDown, setMoodDropDown] = useState([]);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [filter, setFilter] = useState({
        theme: "",
        moods: ""
    })
    const location = useLocation()

    const navigate = useNavigate()

    const getTheme = async () => {
        const themeData = await getthemeApi()
        if (themeData?.success) {
            setThemeDropDown(themeData.data.themes)
            // setThemeDropDown(themeData.data.themes.map(theme => ({ value: theme._id, label: theme.name })));
        }
    }

    // const getMoods = async () => {
    //     const moodData = await getmoodApi()
    //     if (moodData?.success) {
    //         setMoodDropDown(moodData.data.moods)
    //         // setMoodDropDown(moodData.data.moods.map(mood => ({ value: mood._id, label: mood.name })));
    //     }
    // }

    useEffect(() => {
        getTheme()
        // getMoods()
    }, [])

    const onClickAddMeditation = (data) => {
        setopenMeditation(data)
        setData({});
    }

    const appendDataInAdd = async () => {
        setLoader(true)
        setSelectedPage(1)
        const paginateData = {
            number: 1,
            size: recordsPerPage,
            search: searchText,
            theme: filter?.theme?.value?.toString(),
            // mood: filter?.moods?.value?.toString(),
        }
        const data = await getMeditationApi(paginateData, "theme")
        if (data?.success) {
            let paginateData = data?.data?.updateResult
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

    const getMeditationList2 = async (select, size, search) => {
        setLoader(true)
        const paginateData = {
            number: select || selectedPage,
            size: size || recordsPerPage,
            search: search,
            theme: filter?.theme?.value?.toString(),
            // mood: filter?.moods?.value?.toString(),
        }
        const data = await getMeditationApi(paginateData, "theme")
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

    const getMeditationList = async (select) => {
        setLoader(true)
        if (!mainArrayMeditation[select || selectedPage]) {
            const paginateData = {
                number: select || selectedPage,
                size: recordsPerPage,
                search: searchText,
            }
            const data = await getMeditationApi(paginateData, "theme")
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
        else {
            setMeditation(mainArrayMeditation[select || selectedPage])
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
            getMeditationList(location?.state?.activePage)

        } else {
            getMeditationList(1)
            clearAllStateData()
        }
        getUserProfile()
    }, [])

    const onPressDeleteIcon = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete ${data?.meditationName}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const object = {};
                object.meditationId = data?._id;

                await deleteMeditation(object).then(async (submit) => {
                    if (submit?.success) {
                        if (Meditation.length === 1 && selectedPage > 1) {
                            setSelectedPage(selectedPage - 1)
                            await getMeditationList2(selectedPage - 1)

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

    const handleAudioModal = (aud) => {
        setAudioModal(true);
        setUrl(aud)
    }

    const handleEdit = (temp) => {
        onClickAddMeditation(true);
        setData(temp)
    }

    const onClickCloseIcon = async () => {
        setSelectedPage(1)
        setSearchText("")
        await getMeditationList2(1, recordsPerPage, "")
    }

    const onChangeSearchComponent = async (e) => {
        setSearchText(e?.target?.value?.trimStart())
        setSelectedPage(1)
        await getMeditationList2(1, recordsPerPage, e?.target?.value?.trimStart())
    }

    const onChangeDropDownValue = (data, type) => {
        if (type === "theme") {
            setFilter({
                ...filter, theme: data
            })
        } else {
            // setFilter({
            //     ...filter, moods: data
            // })
        }
    }

    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleRecordsPerPageChange = async (value) => {
        const newRecordsPerPage = parseInt(value, 10);
        setRecordsPerPage(newRecordsPerPage);
        setSelectedPage(1); // Reset to the first page
        await getMeditationList2(1, parseInt(value, 10), searchText); // Fetch new data based on the new records per page
    };

    useEffect(() => {
        if (filter.moods !== "" || filter.theme !== "") {
            getMeditationList2()
        }
    }, [filter])

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
                    {imageModal && <ImageModal
                        activeModal={imageModal}
                        setActiveModal={() => { setImageModal(false); setUrl(""); }}
                        img={url}
                        flag="Meditation Image"
                    />}
                    {
                        audioModal && <AudioModal
                            activeModal={audioModal}
                            setActiveModal={() => { setAudioModal(false); setUrl(""); }}
                            aud={url}
                            flag="Meditation Audio" />
                    }
                    <div className="main-content" style={{ minHeight: "100vh" }}>
                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                            <h4 className="mb-sm-0">Meditation Management</h4>
                                            <div className="page-title-right">
                                                <ol className="breadcrumb m-0">
                                                    <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
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
                                                        <div style={{ marginRight: "10px", marginTop: "15px" }}>
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
                                                        <div style={{ display: "flex", marginTop: "15px", flexDirection: 'row', justifyContent: "space-between" }}>
                                                            {/* <div className="ul-dashboard-drop-down">
                                                                <DropdownComponent
                                                                    width={"170px"}
                                                                    options={moodDropDown}
                                                                    onChange={(value) => onChangeDropDownValue(value, "moods")}
                                                                    defaultVal={moodDropDown && moodDropDown[0]}
                                                                    value={filter?.moods}
                                                                    placeholder="Select Moods"
                                                                    isDisabled={false}
                                                                    isMulti={false}
                                                                    isClear={true}
                                                                />
                                                            </div> */}

                                                            <div className="ul-dashboard-drop-down" style={{ marginLeft: '20px' }}>
                                                                <DropdownComponent
                                                                    width={"170px"}
                                                                    options={themeDropDown}
                                                                    onChange={(value) => onChangeDropDownValue(value, "theme")}
                                                                    defaultVal={themeDropDown && themeDropDown[0]}
                                                                    value={filter?.theme}
                                                                    placeholder="Select Theme"
                                                                    isDisabled={false}
                                                                    isMulti={false}
                                                                    isClear={true}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div style={{ marginTop: '15px', marginLeft: '10px' }}>
                                                            <SearchComponent
                                                                data={searchText}
                                                                onChange={(data) => onChangeSearchComponent(data)}
                                                                onClickCloseIcon={onClickCloseIcon} />
                                                        </div>
                                                        <div className="d-grid">
                                                            <button className="btn btn-primary waves-effect waves-light" type="buttom" style={{ height: '40px', marginTop: '15px', marginLeft: '10px' }} onClick={() => onClickAddMeditation(true)} >Add Meditation</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ overflow: "auto" }}>
                                                    <table id="datatable" className="table table-bordered dt-responsive nowrap" style={{ borderCollapse: "collapse", borderSpacing: "0", width: "100%" }}>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th style={{ maxWidth: "100px" }}>Image</th>
                                                                <th style={{ maxWidth: "150px" }}>Name</th>
                                                                <th style={{ maxWidth: "200px" }}>Description</th>
                                                                {/* <th>Moods</th> */}
                                                                <th>Theme</th>
                                                                {/* <th>Rating</th> */}
                                                                <th>Female Audio</th>
                                                                <th>Male Audio</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loader ? <tr><td colSpan={9}>Loading ...</td></tr> : Meditation?.length > 0 ?
                                                                Meditation?.map((elem, index) => {
                                                                    const isExpanded = expandedDescriptions[elem?._id];
                                                                    const description = elem?.description?.length > 100
                                                                        ? isExpanded
                                                                            ? elem?.description
                                                                            : `${elem?.description?.substring(0, 100)}...`
                                                                        : elem?.description;
                                                                    return (
                                                                        <tr key={elem?._id}>
                                                                            <td>{(recordsPerPage * (selectedPage - 1)) + (index + 1)}</td>
                                                                            <td style={{ maxWidth: "100px", alignContent: 'center', whiteSpace: 'normal' }}>{<div className="d-flex flex-row justify-content-center"><img loading="lazy" src={elem?.meditationImage} style={{ height: "100px", width: "100px", objectFit: 'cover', overflow: 'hidden', cursor: "pointer" }} onClick={() => { handleImageModal(elem?.meditationImage) }} /></div>}</td>
                                                                            <td style={{ maxWidth: "150px" }}>{elem?.meditationName}</td>
                                                                            <td style={{ maxWidth: "200px" }}>
                                                                                {description}
                                                                                {elem?.description?.length > 100 && (
                                                                                    <span onClick={() => toggleDescription(elem?._id)} style={{ color: "blue", cursor: "pointer" }}>
                                                                                        {isExpanded ? " See less" : " See more"}
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                            {/* <td>{elem?.moods?.length > 0 ? elem?.moods.map(mood => mood.name).join(", ") : "-"}</td> */}
                                                                            <td>{elem?.theme?.name ? elem?.theme?.name : "-"}</td>
                                                                            {/* <td className="d-flex flex-row justify-content-center">{elem?.overallRating?.toFixed(2)}</td> */}
                                                                            <td>
                                                                                <div className="d-flex flex-row justify-content-center">
                                                                                    {elem?.femaleAudio ?
                                                                                        <>
                                                                                            <FaPlayCircle color="black" size={20} style={{ cursor: 'pointer', marginRight: '5px', marginTop: '3px' }} onClick={() => { handleAudioModal(elem?.femaleAudio) }} />
                                                                                            <p style={{ fontSize: '18px' }}>Play</p>
                                                                                        </>
                                                                                        : "No Audio"}
                                                                                    {/* <button style={{borderRadius:'50px'}} type="button" class="btn btn-primary" onClick={() => { handleAudioModal(elem?.femaleAudio) }}>Play</button> */}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="d-flex flex-row justify-content-center">
                                                                                    {elem?.maleAudio ?
                                                                                        <>
                                                                                            <FaPlayCircle color="black" size={20} style={{ cursor: 'pointer', marginRight: '5px', marginTop: '3px' }} onClick={() => { handleAudioModal(elem?.maleAudio) }} />
                                                                                            <p style={{ fontSize: '18px' }}>Play</p>
                                                                                        </>
                                                                                        :
                                                                                        "No Audio"}
                                                                                    {/* <button style={{borderRadius:'50px'}} type="button" class="btn btn-primary" onClick={() => { handleAudioModal(elem?.maleAudio) }}>Play</button> */}
                                                                                </div>
                                                                            </td>
                                                                            {/* <td style={{ maxWidth: "200px", alignContent: 'center', whiteSpace: 'normal' }}>
                                                                                <div className="d-flex flex-row justify-content-center">
                                                                                    <audio controls>
                                                                                        <source src={elem?.femaleAudio} type="audio/ogg" />
                                                                                        <source src={elem?.femaleAudio} type="audio/mpeg" />
                                                                                    </audio>
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ maxWidth: "200px", alignContent: 'center', whiteSpace: 'normal' }} >
                                                                                <div className="d-flex flex-row justify-content-center">
                                                                                    <audio controls>
                                                                                        <source src={elem?.maleAudio} type="audio/ogg" />
                                                                                        <source src={elem?.maleAudio} type="audio/mpeg" />
                                                                                    </audio>
                                                                                </div>
                                                                            </td> */}
                                                                            <td style={{ display: "flex", cursor: "pointer" }}>
                                                                                <>
                                                                                    <ReactTooltip id="User-info" />
                                                                                    <MdFeedback
                                                                                        style={{ marginRight: "10px" }}
                                                                                        data-tooltip-place="bottom"
                                                                                        data-tooltip-id="User-info"
                                                                                        data-tooltip-content="Feedback"
                                                                                        size={20}
                                                                                        onClick={() => navigate("/feedback-list", { state: { data: elem, selectedPage } })}
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
                                                                : <tr><td colSpan={9}>Meditation not found</td></tr>}
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