import { useEffect, useState } from "react"
import { MdOutlineEmail } from "react-icons/md"
import { RxCross2 } from "react-icons/rx"
import DropdownComponent from "../../../component/DropDown/Dropdown";
import { getLoggedinUserProfile, updateProfileData } from "../../../services/profile";
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts";
// import { uploadImageService } from "../../../services/imageFIle";
import { useDispatch } from "react-redux";
import { getUserDataAction } from "../../../ReduxStore/Actions/header";

function Profile() {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: ""
    })

    const [initialData, setInitialData] = useState({
        name: "",
        email: "",
        image: ""
    })
    const [submitForm, setSubmitForm] = useState(false)
    const [loaderEdit, setLoaderEdit] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [errors, setErrors] = useState({});
    const [loader, setLoader] = useState(false)
    const [previewImage, setPreviewImage] = useState(null);
    
    const onChangeTextValue = (e) => {
        const { name, value } = e.target
        const isValid = /^[a-zA-Z\s]*$/.test(value);
        if (isValid) {
            const finalData = { ...formData, [name]: value.trimStart() }
            if (JSON.stringify(initialData) !== JSON.stringify(finalData)) {
                setDisabled(false)
            } else {
                setDisabled(true)
            }
            if (submitForm) {
                validateForm(finalData)
            }
            setFormData(finalData)
        }
    }

    const getUserProfile = async () => {
        const profileData = await getLoggedinUserProfile()
        if (profileData?.success) {
            const finalFormData = {
                ...profileData?.data,
                image: profileData?.data?.profilePic
            }
            setFormData(finalFormData)
            setInitialData(finalFormData)
            dispatch(getUserDataAction(profileData?.data))
            setDisabled(true)
            setPreviewImage(profileData?.data?.profilePic)
        }
        else {
            displayErrorToast(profileData?.message || "something went wrong while get user profile")
        }
        setLoader(false);
    }

    useEffect(() => {
        setLoader(true);
        getUserProfile()
    }, [])


    const validateForm = (data) => {
        let isValid = true;
        const newErrors = {};

        if (!data.name) {
            newErrors.name = "name is required";
            isValid = false;
        }

        if (!data.image) {
            newErrors.image = "image is required";
            isValid = false;
        }

        if (typeof (data.image) === "object") {
            if (data.image.type.includes("video")) {
                newErrors.image = "Only image(jpeg) is allowed";
                isValid = false;
            }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitForm(true);
        const valid = validateForm(formData)

        if (valid) {
            setSubmitForm(false)
            setLoaderEdit(true);
            if (initialData?.image !== previewImage) {
                const imageUploaf = new FormData();
                imageUploaf.append("profilePic", formData?.image);
                imageUploaf.append("name", formData?.name);
                await updateProfileDataValue(imageUploaf);

            } else {
                const imageUploaf = new FormData();
                imageUploaf.append("name", formData?.name);
                await updateProfileDataValue(imageUploaf);
            }
            setLoaderEdit(false);
        }
    }

    const updateProfileDataValue = async (data) => {
        const finalData = await updateProfileData(data)
        if (finalData?.success) {
            await getUserProfile();
            displaySuccessToast(finalData?.message || "Profile Updated successfully")
        } else {
            displayErrorToast(finalData?.message || "something went wrong while updating profile")
        }
        setLoaderEdit(false);
    }

    const onChangeDropDownValue = (data) => {
        if (submitForm) {
            validateForm({ ...formData, role: data })
        }
        setFormData({
            ...formData, role: data
        })
    }

    const onClickPhoto = async (e) => {
        const selectedFile = e.currentTarget.files[0];
        const imageUrl = URL.createObjectURL(selectedFile);
        const newSelectedFile = e.target.files[0];
        setPreviewImage(imageUrl);
        const data = { ...formData, image: newSelectedFile }
        if (JSON.stringify(initialData) !== JSON.stringify(data)) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
        setFormData(data);
    };

    const onClickCrossIcon = () => {
        setPreviewImage(null);
        setFormData({ ...formData, image: null })
    };

    const onClickCencleButtonClick = () => {
        setFormData(initialData)
        setPreviewImage(initialData?.image)
        setErrors({})
        setDisabled(true)
    }

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                }}
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-4 col-lg-4 col-md-4 pass-form-wrapper">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="asa-header-design">Profile Details</div>
                                </div>
                                <form
                                    className="form-horizontal p-4"
                                    onSubmit={handleSubmit}
                                >
                                    {loader ? "Loading ..." :

                                        <fieldset disabled={loader || loaderEdit}>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="mb-4">
                                                        <label className="form-label" htmlFor="name">
                                                            name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="name"
                                                            placeholder="Enter name"
                                                            name="name"
                                                            onChange={onChangeTextValue}
                                                            value={formData?.name}
                                                        />
                                                        {errors?.name && (
                                                            <div className="error-message">
                                                                {errors?.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="form-label" htmlFor="Email">
                                                            Email
                                                        </label>
                                                        <div className="input-with-icon-label">
                                                            <input
                                                                readOnly
                                                                type="text"
                                                                className="form-control input-feild-padding"
                                                                id="email"
                                                                placeholder="Enter Email"
                                                                name="email"
                                                                onChange={onChangeTextValue}
                                                                value={formData?.email}
                                                            />
                                                            <MdOutlineEmail className="input-with-icon-design-right" />
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        {previewImage ? (
                                                            <div className="image-container">
                                                                <img
                                                                    src={previewImage}
                                                                    alt="Preview"
                                                                    style={{
                                                                        maxWidth: "100%",
                                                                        marginTop: "8px",
                                                                    }}
                                                                />
                                                                <div
                                                                    onClick={() => onClickCrossIcon()}
                                                                    className="cross-icon bg-primary"
                                                                >
                                                                    <RxCross2
                                                                        color="#fff"
                                                                        size={20}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <input
                                                                    accept="image/*"
                                                                    id="photo"
                                                                    name="photo"
                                                                    type="file"
                                                                    onChange={(event) =>
                                                                        onClickPhoto(event)
                                                                    }
                                                                    style={{ display: "none" }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary waves-effect waves-light"
                                                                >
                                                                    <label
                                                                        style={{ marginBottom: "0px" }}
                                                                        htmlFor="photo"
                                                                    >
                                                                        Upload Photo
                                                                    </label>
                                                                </button>
                                                                {errors?.image && (
                                                                    <div className="error-message">
                                                                        {errors?.image}
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="mt-4" style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <button
                                                            style={{ width: "40%", border: "1px solid #ced4da" }}
                                                            className="btn waves-effect waves-light"
                                                            type="button"
                                                            onClick={() => onClickCencleButtonClick()}
                                                        >
                                                            Reset
                                                        </button>
                                                        <button
                                                            style={{ width: "50%" }}
                                                            className="btn btn-primary waves-effect waves-light"
                                                            type="submit"
                                                            disabled={disabled}
                                                        >
                                                            {loaderEdit ? "loading.." : "Update Profile"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>)
}

export default Profile