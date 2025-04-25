import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts";
import { managetheme } from "../../../services/theme";
const PIE_API_URL = import.meta.env.VITE_REACT_IMAGE_URL;

function AddCategory({ closeWrapper, appendDataInAdd, data }) {

    const [formData, setFormData] = useState({
        name: "",
        image: "",
        logoImage: ""
    })
    const [initialData, setInitialData] = useState({
        name: "",
        image: "",
        logoImage: ""
    })
    const [submitForm, setSubmitForm] = useState(false)
    const [previewImage, setPreviewImage] = useState(null);
    const [previewImage2, setPreviewImage2] = useState(null);
    const [loader, setLoader] = useState(false)
    const [errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoader(true);
        setSubmitForm(true)
        const isValidate = validateForm(formData)
        if (isValidate) {
            if (data?._id) {
                let imageChanged = initialData.image !== formData.image;
                let logoChanged = initialData.logoImage !== formData.logoImage;
                const object = new FormData();

                if (imageChanged) {
                    object.append("image", formData?.image);
                }

                if (logoChanged) {
                    object.append("logoImage", formData?.logoImage);
                }

                try {
                    object.append("name", formData?.name);
                    object.append("themeId", data._id);
                    const submit = await managetheme(object)
                    if (submit?.success) {
                        displaySuccessToast(submit?.message || "Data Updated successfully");
                        closeWrapper(false)
                        appendDataInAdd()
                    }
                    else {
                        displayErrorToast(submit?.message || "something went wrong while adding data")
                    }
                } catch (error) {
                    displayErrorToast(error?.message || "something went wrong while adding data")
                }
            }
            else {
                const object = new FormData();
                object.append("image", formData?.image);
                object.append("name", formData?.name);
                object.append("logoImage", formData?.logoImage);
                const submit = await managetheme(object)
                if (submit?.success) {
                    displaySuccessToast(submit?.message || "Data added successfully");
                    closeWrapper(false)
                    appendDataInAdd()
                }
                else {
                    displayErrorToast(submit?.message || "something went wrong while adding data")
                }
            }
        }

        setLoader(false);
    }

    useEffect(() => {
        if (data._id) {
            setPreviewImage(data?.image)
            setPreviewImage2(data?.logoImage)
            setFormData({
                name: data.name,
                image: data.image,
                logoImage: data.logoImage
            })
            setInitialData({
                name: data.name,
                image: data.image,
                logoImage: data.logoImage
            })
        }
    }, [data])

    const validateForm = (data) => {
        let isValid = true;
        const newErrors = {};

        if (!data.name) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        if (data.name) {
            if (data.name.length > 100) {
                newErrors.name = "Name should be less than 100 characters";
                isValid = false;
            }
        }

        if (!data.image) {
            newErrors.image = "Image is required";
            isValid = false;
        }

        if (typeof (data.image) === "object") {
            if (!data.image.type.includes("image")) {
                newErrors.image = "Only image should allowed";
                isValid = false;
            }
        }

        if (!data.logoImage) {
            newErrors.logoImage = "Logo is required";
            isValid = false;
        }
        
        if (typeof (data.logoImage) === "object") {
            if (!data.logoImage.type.includes("image")) {
                newErrors.logoImage = "Only image should allowed";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const onChangeInputFeild = (e) => {
        const { name, value } = e.target;
        const newValue = value.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
        if (submitForm) {
            validateForm({ ...formData, [name]: newValue.trimStart() });
        }
        setFormData({
            ...formData, [name]: newValue.trimStart()
        });
    };

    const onClickCrossIcon = (type) => {
        if (type === "img") {
            setPreviewImage(null);
            setFormData({ ...formData, image: "" });
        } else {
            setPreviewImage2(null);
            setFormData({ ...formData, logoImage: "" });
        }
    };

    const onClickPhoto = async (e, type) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        // console.log("====================",type)

        reader.onloadend = () => {
            if (type === "img") {
                setPreviewImage(reader.result);
                setFormData({ ...formData, image: file });
            } else {
                setPreviewImage2(reader.result);
                setFormData({ ...formData, logoImage: file });
            }
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (submitForm) {
            validateForm(formData)
        }
    }, [formData])



    return (
        <div className="main-wrapper-fixed-position">
            <div className="asa-main-wrapper-right" onClick={(e) => e.stopPropagation()}>
                <RxCross2 className="asa-cross-icon" size={20} onClick={() => closeWrapper(false)} />
                <div className="asa-header-design">{data?._id ? "Update Theme" : "Add Theme"}</div>
                <form
                    className="form-horizontal"
                    style={{ marginTop: "35px" }}
                    onSubmit={handleSubmit}
                >
                    <fieldset disabled={loader}>
                        <div className="row">
                            <div className="col-md-12">

                                <div className="mb-4">
                                    <label
                                        className="form-label"
                                        htmlFor="name"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter name"
                                        name="name"
                                        onChange={onChangeInputFeild}
                                        value={formData.name}
                                    />
                                    {errors?.name && (
                                        <div className="error-message">
                                            {errors?.name}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    {previewImage2 ? (
                                        <>
                                            <label
                                                className="form-label"
                                                htmlFor="photo1"
                                                style={{ marginBottom: "0px" }}
                                            >
                                                Logo
                                            </label>
                                            <div className="image-container">
                                                <img
                                                    src={previewImage2}
                                                    alt="Preview"
                                                    style={{
                                                        maxWidth: "100%",
                                                        marginTop: "8px",
                                                    }}
                                                />
                                                <div
                                                    onClick={() => onClickCrossIcon("logo")}
                                                    className="cross-icon bg-primary"
                                                // style={Object.keys(errors).length === 3 ? { marginTop: "135px" } : Object.keys(errors).length === 2 ? { marginTop: "120px" } : Object.keys(errors).length === 1 ? { marginTop: "105px" } : { marginTop: "90px" }}
                                                >
                                                    <RxCross2
                                                        color="#fff"
                                                        size={20}
                                                    />
                                                </div>
                                                {errors?.logoImage && (
                                                    <div className="error-message">
                                                        {errors?.logoImage}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (

                                        <>
                                            <input
                                                accept="image/*"
                                                id="photo"
                                                name="photo"
                                                type="file"
                                                onChange={(event) =>
                                                    onClickPhoto(event, "logo")
                                                }
                                                style={{ display: "none" }}
                                            />
                                            <label
                                                    style={{ marginBottom: "0px",padding: '10px', background: '#1F1F1F', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}
                                                    htmlFor="photo"
                                                >
                                                    Upload Female Audio
                                            </label>
                                            {errors?.logoImage && (
                                                <div className="error-message">
                                                    {errors?.logoImage}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="mb-4">
                                    {previewImage ? (
                                        <>
                                            <label
                                                className="form-label"
                                                htmlFor="photo"
                                                style={{ marginBottom: "0px" }}
                                            >
                                                Image
                                            </label>
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
                                                    onClick={() => onClickCrossIcon("img")}
                                                    className="cross-icon bg-primary"
                                                // style={Object.keys(errors).length === 3 ? { marginTop: "135px" } : Object.keys(errors).length === 2 ? { marginTop: "120px" } : Object.keys(errors).length === 1 ? { marginTop: "105px" } : { marginTop: "90px" }}
                                                >
                                                    <RxCross2
                                                        color="#fff"
                                                        size={20}
                                                    />
                                                </div>
                                                {errors?.image && (
                                                    <div className="error-message">
                                                        {errors?.image}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                accept="image/*"
                                                id="photo"
                                                name="photo"
                                                type="file"
                                                onChange={(event) =>
                                                    onClickPhoto(event, "img")
                                                }
                                                style={{ display: "none" }}
                                            />
                                            <label
                                                    style={{ marginBottom: "0px",padding: '10px', background: '#1F1F1F', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}
                                                    htmlFor="photo"
                                                >
                                                    Upload Image
                                            </label>
                                            {errors?.image && (
                                                <div className="error-message">
                                                    {errors?.image}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="d-grid mt-4">
                                    <button className="btn btn-primary" type="submit" disabled={loader}>{loader ? 'Processing..' : data?._id ? 'Update theme' : 'Add theme'}</button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>

        </div>
    )
}

export default AddCategory