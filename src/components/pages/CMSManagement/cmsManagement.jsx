import { useEffect, useState } from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from "../../layout/Header";
import Sidebar from "../../layout/Sidebar";
import { UpdateCmsData, getListOfCmsDataApi } from "../../../services/cmsApi";
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts";
// import { userRoleTypeForSuper } from "../../../constant/constanant";
import { useSelector } from "react-redux";
import { getLoggedinUserProfile } from "../../../services/profile";

const cmsConstData = [{
    id: 1,
    value: "Terms and Conditions",
    data: ""
},
{
    id: 2,
    value: "Privacy Policy",
    data: ""
}, {
    id: 3,
    value: "About us",
    data: ""
}
]

function CMSMangement() {
    const userRoleType = useSelector((state) => state.headerReducer?.useData)

    const [selectedTab, setSelectedtab] = useState(cmsConstData[0]?.id)
    const [editorText, setEditorText] = useState(cmsConstData[0]?.data)
    const [cmsData, setCmsData] = useState(cmsConstData)
    const [id, setId] = useState("")
    const [loaderData, setLoaderData] = useState(false)
    const [updateLoader, setUpdateLoader] = useState(false)

    const onClickTabData = (data) => {
        setSelectedtab(data?.id)
        setEditorText(data?.data)
        const finalCmsData = cmsData?.map((data) => {
            return {
                ...data,
                data: data?.id === 1 ? finalData?.data?.terms_condition : data?.id === 2 ? finalData?.data?.privacy_policy : finalData?.data?.about_us
            }
        })

        setCmsData(finalCmsData)
    }

    const onClickUpdateBtnClick = async () => {
        setUpdateLoader(true)
        const finalData = cmsData?.map((d) => {
            return (
                d?.id === selectedTab ? { ...d, data: editorText } : d
            )
        })



        const finalCMSData = finalData[0]?.id == selectedTab ? { ["termsCondition"]: finalData[0]?.data } :
            finalData[1]?.id == selectedTab ? { ["privacyPolicy"]: finalData[1]?.data } :
                finalData[2]?.id == selectedTab ? { ["aboutUs"]: finalData[2]?.data } : null

        const updateCms = await UpdateCmsData(finalCMSData)
        if (updateCms?.status || updateCms?.success) {
            setId(finalCMSData)
            displaySuccessToast(updateCms?.message || "Cms updated successfully")
            setCmsData(finalData)
        } else {
            displayErrorToast(updateCms?.message || "Something Went Wrong")
        }
        setUpdateLoader(false)

    }

    const onChangeTextEditor = (data) => {
        setEditorText(data)
    }

    const getListOfCMSData = async () => {
        setLoaderData(true)
        const finalData = await getListOfCmsDataApi()
        if (finalData?.success || finalData?.status) {
            const finalCmsData = cmsData?.map((data) => {
                return {
                    ...data,
                    data: data?.id === 1 ? finalData?.data?.termsCondition : data?.id === 2 ? finalData?.data?.privacyPolicy : finalData?.data?.aboutUs
                }
            })
            setEditorText(finalData?.data?.termsCondition)
            setId(finalData?.data)
            setCmsData(finalCmsData)
        } else {
            displayErrorToast(finalData?.message || "Something went wrong")
        }
        setLoaderData(false)
    }
    useEffect(() => {
        getUserProfile()
        getListOfCMSData()
    }, [])

    const getUserProfile = async () => {
        const profileData = await getLoggedinUserProfile()
        if (!profileData?.success) {
            localStorage.clear()
            window.location.reload();
            displayErrorToast(profileData?.message || "something went wrong while get user profile")
        }
    }

    return (
        <>
            <div data-sidebar="dark">
                <div id="layout-wrapper">
                    <Header />
                    <Sidebar />
                    <div className="main-content" style={{ minHeight: "100vh" }}>
                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                            <h4 className="mb-sm-0">CMS Management</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">

                                        {loaderData ? "Loading..." :
                                            <div className="card mb-0">
                                                <div className="card-body">
                                                    <ul className="nav nav-tabs nav-justified nav-tabs-custom" role="tablist">
                                                        {cmsData?.map((data) => {
                                                            return (
                                                                <>
                                                                    <li className="nav-item" role="presentation" onClick={() => onClickTabData(data)} style={{ cursor: "pointer" }}>
                                                                        <a className={selectedTab == data?.id ? "nav-link active" : "nav-link"} style={{ height: "100%", color: "black" }} data-bs-toggle="tab" role="tab" aria-selected="false">
                                                                            {data?.value}
                                                                        </a>
                                                                    </li >
                                                                </>
                                                            )
                                                        })
                                                        }
                                                    </ul>

                                                    <div className="mt-4">
                                                        <ReactQuill
                                                            // readOnly={userRoleType?.type == userRoleTypeForSuper ? false : true}
                                                            theme="snow" value={editorText} onChange={onChangeTextEditor} />
                                                    </div>


                                                    <div className="mt-4">
                                                        <button
                                                            className="btn btn-primary waves-effect waves-light"
                                                            type="click"
                                                            onClick={() => onClickUpdateBtnClick()}
                                                            disabled={updateLoader}
                                                        >
                                                            {updateLoader ? "Loading.." : "Update"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CMSMangement