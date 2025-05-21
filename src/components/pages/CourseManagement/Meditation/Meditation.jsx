import { lazy, useEffect, useState } from "react";
import Header from "../../../layout/Header";
import Sidebar from "../../../layout/Sidebar";
import AddMeditation from "./AddMeditation";
import "./Meditation.css";
import {
  getMeditationApi,
  deleteMeditation,
  UpdateIndexingApi,
} from "../../../../services/meditation";
import {
  displayErrorToast,
  displaySuccessToast,
} from "../../../../Utills/displayToasts";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { MdDelete, MdEdit, MdFeedback } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { GrPrevious, GrNext } from "react-icons/gr";
import { getLoggedinUserProfile } from "../../../../services/profile";
import _ from "lodash";
import ImageModal from "../../../layout/ImageModal";
import AudioModal from "../../../layout/AudioModal";
import Swal from "sweetalert2";
import { FaPlayCircle } from "react-icons/fa";
import SearchComponent from "../../../../component/Search/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const numberPerPage = 1000;

function Meditation2() {
  const location = useLocation();
  let { stage } = location.state;

  if (!stage) {
    stage = JSON.parse(localStorage.getItem("stage"));
  }

  const [openMeditation, setopenMeditation] = useState(false);
  const [loader, setLoader] = useState(true);
  const [Meditation, setMeditation] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [mainArrayMeditation, setmainArrayMeditation] = useState({});
  const [imageModal, setImageModal] = useState(false);
  const [audioModal, setAudioModal] = useState(false);
  const [url, setUrl] = useState("");
  const [data, setData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [originalOrder, setOriginalOrder] = useState([]);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const navigate = useNavigate();

  const onClickAddMeditation = (data) => {
    setopenMeditation(data);
    setData({});
  };

  const appendDataInAdd = async () => {
    setLoader(true);
    setSelectedPage(1);
    const paginateData = {
      number: 1,
      size: numberPerPage,
      search: searchText,
    };
    const data = await getMeditationApi(
      paginateData,
      "course",
      stage.stage,
      "index",
      "asc"
    );
    if (data?.success) {
      let paginateData = data?.data?.updateResult;
      // paginateData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTotalPage(data?.data?.totalPages);
      const mergeData = { [1]: paginateData };
      setmainArrayMeditation(mergeData);
      setMeditation(paginateData);
      setOriginalOrder([...paginateData]);
    } else {
      displayErrorToast(
        data?.message || "something went wrong while fetching data"
      );
    }
    setLoader(false);
  };

  const getMeditationList2 = async (select, search) => {
    setLoader(true);
    const paginateData = {
      number: select || selectedPage,
      size: numberPerPage,
      search: search,
    };
    const data = await getMeditationApi(
      paginateData,
      "course",
      stage.stage,
      "index",
      "asc"
    );
    if (data?.success) {
      let paginateData = data?.data?.updateResult;
      setTotalPage(data?.data?.totalPages);
      const mergeData = {
        ...mainArrayMeditation,
        [select || selectedPage]: paginateData,
      };
      setmainArrayMeditation(mergeData);
      setMeditation(paginateData);
      setOriginalOrder([...paginateData]);
    } else {
      displayErrorToast(
        data?.message || "something went wrong while fetching data"
      );
    }
    setLoader(false);
  };

  const getMeditationList = async (select) => {
    setLoader(true);
    if (!mainArrayMeditation[select || selectedPage]) {
      const paginateData = {
        number: select || selectedPage,
        size: numberPerPage,
        search: searchText,
      };
      const data = await getMeditationApi(
        paginateData,
        "course",
        stage.stage,
        "index",
        "asc"
      );
      if (data?.success) {
        let paginateData = data?.data?.updateResult;
        setTotalPage(data?.data?.totalPages);
        const mergeData = {
          ...mainArrayMeditation,
          [select || selectedPage]: paginateData,
        };
        setmainArrayMeditation(mergeData);
        setMeditation(paginateData);
        setOriginalOrder([...paginateData]);
      } else {
        displayErrorToast(
          data?.message || "something went wrong while fetching data"
        );
      }
      setLoader(false);
    } else {
      setMeditation(mainArrayMeditation[select || selectedPage]);
    }
    setLoader(false);
  };

  useEffect(() => {
    setLoader(true);
    getMeditationList();
    getUserProfile();
  }, []);

  useEffect(() => {
    // Check if the order has changed and update isOrderChanged accordingly
    setIsOrderChanged(
      !originalOrder.every((item, index) => Meditation[index] === item)
    );
  }, [Meditation, originalOrder]);

  const onPressDeleteIcon = async (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete ${data?.title}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const object = {};
        object.meditationId = data?._id;

        await deleteMeditation(object).then(async (submit) => {
          if (submit?.success) {
            if (Meditation.length === 1 && selectedPage > 1) {
              setSelectedPage(selectedPage - 1);
              await getMeditationList2(selectedPage - 1);
            } else {
              await getMeditationList2();
            }
            displaySuccessToast("Deleted successfully");
          } else {
            displayErrorToast(
              submit?.message || "something went wrong while adding data"
            );
          }
        });
      }
    });
  };

  const handlePageClick = async (data) => {
    setLoader(true);
    const pageNo = data.selected + 1;
    await getMeditationList(pageNo);
    setSelectedPage(pageNo);
  };

  const getUserProfile = async () => {
    const profileData = await getLoggedinUserProfile();
    if (!profileData?.success) {
      localStorage.clear();
      window.location.reload();
      displayErrorToast(
        profileData?.message || "something went wrong while get user profile"
      );
    }
  };

  const handleImageModal = (img) => {
    setImageModal(true);
    setUrl(img);
  };

  const handleEdit = (temp) => {
    onClickAddMeditation(true);
    setData(temp);
  };

  const onClickCloseIcon = async () => {
    setSelectedPage(1);
    setSearchText("");
    await getMeditationList2(1, "");
  };

  const onChangeSearchComponent = async (e) => {
    setSearchText(e?.target?.value?.trimStart());
    setSelectedPage(1);
    await getMeditationList2(1, e?.target?.value?.trimStart());
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(Meditation);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMeditation(items);
    setIsOrderChanged(true);
  };

  const handleUpdateOrder = async () => {
    // Implement the API call to update the order in the backend
    const data = {};
    data.stageId = stage.stage;
    data.meditation_data = Meditation.map((item, index) => {
      return {
        meditationId: item._id,
        index: index + 1,
      };
    }); // Add the order of each Meditation here
    const res = await UpdateIndexingApi(data);
    if (res?.success) {
      displaySuccessToast(res?.message || "Order updated successfully");
      setOriginalOrder([...Meditation]);
      setIsOrderChanged(false);
    } else {
      displayErrorToast(
        res?.message || "something went wrong while updating order"
      );
    }
  };

  const handleAudioModal = (aud) => {
    setAudioModal(true);
    setUrl(aud);
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <div data-sidebar="dark">
        {openMeditation && (
          <AddMeditation
            appendDataInAdd={appendDataInAdd}
            closeWrapper={onClickAddMeditation}
            data={data}
            id={stage}
          />
        )}
        <div id="layout-wrapper">
          <Header />
          <Sidebar />
          {imageModal && (
            <ImageModal
              activeModal={imageModal}
              setActiveModal={() => {
                setImageModal(false);
                setUrl("");
              }}
              img={url}
              flag="Meditation Image"
            />
          )}
          {audioModal && (
            <AudioModal
              activeModal={audioModal}
              setActiveModal={() => {
                setAudioModal(false);
                setUrl("");
              }}
              aud={url}
              flag="Meditation Audio"
            />
          )}
          <div className="main-content" style={{ minHeight: "100vh" }}>
            <div className="page-content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                      <h4 className="mb-sm-0">Meditation Management</h4>
                      <div className="page-title-right">
                        <ol className="breadcrumb m-0">
                          <li
                            className="breadcrumb-item"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate("/course", {
                                state: {
                                  activePage: location?.state?.selectedPage,
                                },
                              })
                            }
                          >
                            <a>course</a>
                          </li>
                          <li className="breadcrumb-item active">
                            Meditation Management
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingBottom: "15px",
                          }}
                        >
                          <h4 className="card-title">List of Meditation</h4>
                          <div className="d-flex flex-row">
                            <div style={{ marginRight: "10px" }}>
                              <SearchComponent
                                data={searchText}
                                onChange={(data) =>
                                  onChangeSearchComponent(data)
                                }
                                onClickCloseIcon={onClickCloseIcon}
                              />
                            </div>
                            <div className="d-grid">
                              <button
                                className="btn btn-primary waves-effect waves-light"
                                type="buttom"
                                onClick={() => onClickAddMeditation(true)}
                              >
                                Add Meditation
                              </button>
                            </div>
                            <div
                              className="d-grid"
                              style={{ marginLeft: "10px" }}
                            >
                              <button
                                className="btn btn-primary waves-effect waves-light"
                                type="buttom"
                                onClick={() => handleUpdateOrder()}
                                disabled={!isOrderChanged}
                              >
                                Update Order
                              </button>
                            </div>
                          </div>
                        </div>
                        <div style={{ overflow: "auto" }}>
                          <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="Meditations">
                              {(provided) => (
                                <table
                                  id="datatable"
                                  className="table table-bordered dt-responsive nowrap"
                                  style={{
                                    borderCollapse: "collapse",
                                    borderSpacing: "0",
                                    width: "100%",
                                  }}
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th style={{ maxWidth: "100px" }}>
                                        Image
                                      </th>
                                      <th style={{ maxWidth: "100px" }}>
                                        Name
                                      </th>
                                      <th style={{ maxWidth: "200px" }}>
                                        Description
                                      </th>
                                      <th>Course</th>
                                      {/* <th>Stage</th> */}
                                      {/* <th>Rating</th> */}
                                      <th>Female Audio</th>
                                      <th>Male Audio</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {loader ? (
                                      <tr>
                                        <td colSpan={9} className="text-center">
                                          Loading ...
                                        </td>
                                      </tr>
                                    ) : Meditation?.length > 0 ? (
                                      Meditation?.map((elem, index) => {
                                        const isExpanded =
                                          expandedDescriptions[elem?._id];
                                        const description =
                                          elem?.description?.length > 100
                                            ? isExpanded
                                              ? elem?.description
                                              : `${elem?.description?.substring(
                                                  0,
                                                  100
                                                )}...`
                                            : elem?.description;
                                        return (
                                          <Draggable
                                            key={elem?._id}
                                            draggableId={elem?._id.toString()}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <tr
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                              >
                                                <td>
                                                  {numberPerPage *
                                                    (selectedPage - 1) +
                                                    (index + 1)}
                                                </td>
                                                <td
                                                  style={{
                                                    maxWidth: "100px",
                                                    alignContent: "center",
                                                    whiteSpace: "normal",
                                                  }}
                                                >
                                                  {
                                                    <div className="d-flex flex-row justify-content-center">
                                                      <img
                                                        loading="lazy"
                                                        src={
                                                          elem?.meditationImage
                                                        }
                                                        style={{
                                                          height: "100px",
                                                          width: "100px",
                                                          objectFit: "cover",
                                                          overflow: "hidden",
                                                          cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                          handleImageModal(
                                                            elem?.meditationImage
                                                          );
                                                        }}
                                                      />
                                                    </div>
                                                  }
                                                </td>
                                                <td
                                                  style={{ maxWidth: "100px" }}
                                                >
                                                  {elem?.meditationName}
                                                </td>
                                                <td
                                                  style={{ maxWidth: "200px" }}
                                                >
                                                  {description}
                                                  {elem?.description?.length >
                                                    100 && (
                                                    <span
                                                      onClick={() =>
                                                        toggleDescription(
                                                          elem?._id
                                                        )
                                                      }
                                                      style={{
                                                        color: "blue",
                                                        cursor: "pointer",
                                                      }}
                                                    >
                                                      {isExpanded
                                                        ? " See less"
                                                        : " See more"}
                                                    </span>
                                                  )}
                                                </td>
                                                <td>
                                                  {elem?.course
                                                    ? elem?.course?.name
                                                    : "-"}
                                                </td>
                                                {/* <td>
                                                  {elem?.stage
                                                    ? elem?.stage?.title
                                                    : "-"}
                                                </td> */}
                                                {/* <td className="d-flex flex-row justify-content-center">{elem?.overallRating?.toFixed(2)}</td> */}
                                                <td>
                                                  <div className="d-flex flex-row justify-content-center">
                                                    {elem?.femaleAudio ? (
                                                      <>
                                                        <FaPlayCircle
                                                          color="black"
                                                          size={20}
                                                          style={{
                                                            cursor: "pointer",
                                                            marginRight: "5px",
                                                            marginTop: "3px",
                                                          }}
                                                          onClick={() => {
                                                            handleAudioModal(
                                                              elem?.femaleAudio
                                                            );
                                                          }}
                                                        />
                                                        <p
                                                          style={{
                                                            fontSize: "18px",
                                                          }}
                                                        >
                                                          Play
                                                        </p>
                                                      </>
                                                    ) : (
                                                      "No Audio"
                                                    )}
                                                    {/* <button style={{borderRadius:'50px'}} type="button" class="btn btn-primary" onClick={() => { handleAudioModal(elem?.femaleAudio) }}>Play</button> */}
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="d-flex flex-row justify-content-center">
                                                    {elem?.maleAudio ? (
                                                      <>
                                                        <FaPlayCircle
                                                          color="black"
                                                          size={20}
                                                          style={{
                                                            cursor: "pointer",
                                                            marginRight: "5px",
                                                            marginTop: "3px",
                                                          }}
                                                          onClick={() => {
                                                            handleAudioModal(
                                                              elem?.maleAudio
                                                            );
                                                          }}
                                                        />
                                                        <p
                                                          style={{
                                                            fontSize: "18px",
                                                          }}
                                                        >
                                                          Play
                                                        </p>
                                                      </>
                                                    ) : (
                                                      "No Audio"
                                                    )}
                                                    {/* <button style={{borderRadius:'50px'}} type="button" class="btn btn-primary" onClick={() => { handleAudioModal(elem?.maleAudio) }}>Play</button> */}
                                                  </div>
                                                </td>
                                                <td
                                                  style={{
                                                    display: "flex",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  {/* <>
                                                                                                        <ReactTooltip id="User-info" />
                                                                                                        <MdFeedback
                                                                                                            style={{ marginRight: "10px" }}
                                                                                                            data-tooltip-place="bottom"
                                                                                                            data-tooltip-id="User-info"
                                                                                                            data-tooltip-content="Feedback"
                                                                                                            size={20}
                                                                                                            onClick={() => {
                                                                                                                localStorage.setItem("stage", JSON.stringify(stage))
                                                                                                                navigate("/feedback-list", { state: { data: elem, type: 'course', selectedPage, stage } })
                                                                                                            }}
                                                                                                        />
                                                                                                    </> */}
                                                  <>
                                                    <ReactTooltip id="edit-comm" />
                                                    <MdEdit
                                                      data-tooltip-place="bottom"
                                                      data-tooltip-id="edit-comm"
                                                      data-tooltip-content="Edit"
                                                      style={{
                                                        marginRight: "10px",
                                                      }}
                                                      onClick={() =>
                                                        handleEdit(elem)
                                                      }
                                                      size={20}
                                                    />
                                                  </>
                                                  <>
                                                    <ReactTooltip id="delete-comm" />
                                                    <MdDelete
                                                      data-tooltip-place="bottom"
                                                      data-tooltip-id="delete-comm"
                                                      data-tooltip-content="Delete"
                                                      size={20}
                                                      onClick={() => {
                                                        onPressDeleteIcon(elem);
                                                      }}
                                                    />
                                                  </>
                                                </td>
                                              </tr>
                                            )}
                                          </Draggable>
                                        );
                                      })
                                    ) : (
                                      <tr>
                                        <td colSpan={9}>
                                          Meditation not found
                                        </td>
                                      </tr>
                                    )}
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
      </div>
    </>
  );
}

export default Meditation2;
