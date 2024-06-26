import { useLocation, useNavigate } from "react-router-dom"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import ColDetail from "./ColDetail"
import { IoMdArrowRoundBack } from "react-icons/io";

function ViewTranslatorDetails() {
    const location = useLocation()

    const { data } = location.state
    const navigate = useNavigate()
    const onClickBackBtn = () => {
        navigate(location?.state?.pathname, {
            state: { activePage: location?.state?.selectedPage }
        })
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
                                            <h4 className="mb-sm-0">Bussiness User Details</h4>
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
                                                <IoMdArrowRoundBack style={{ cursor: "pointer" }} onClick={() => onClickBackBtn()} /> Details of {data?.first_name} {data?.last_name}
                                            </span>
                                            {/* <i className="fa fa-edit ml-2" onClick={()=>{navigate("/edit-guru-details", {state: data,})}}></i> */}
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row" >
                                        <ColDetail title="Name" data={`${data?.first_name} ${data?.last_name}`} />
                                        <ColDetail title="email" data={`${data?.email}`} />
                                        <ColDetail title="Business Name" data={`${data?.business_name}`} />
                                        <ColDetail title="Business Email" data={`${data?.business_email}`} />
                                        <ColDetail title="Country" data={`${data?.location?.address?.country ? data?.location?.address?.country : "-"}`} />
                                        <ColDetail title="State" data={`${data?.location?.address?.state_code ? data?.location?.address?.state_code : "-"}`} />
                                        <ColDetail title="City" data={`${data?.location?.address?.city ? data?.location?.address?.city : "-"}`} />
                                        <ColDetail title="phone_number" data={`${data?.country_code} ${data?.phone_number}`} />
                                    </div>
                                    <div>
                                        <span className="restaurant_heading " style={{ fontWeight: 700, lineHeight: 2 }}>Bussiness Category</span>
                                        <ol
                                            style={{ marginLeft: "-15px" }}>
                                            {
                                                data?.business_category?.map((cat, index) => {
                                                    return (
                                                        <li
                                                            key={index}
                                                        >{cat}</li>
                                                    )
                                                })
                                            }
                                        </ol>
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

export default ViewTranslatorDetails