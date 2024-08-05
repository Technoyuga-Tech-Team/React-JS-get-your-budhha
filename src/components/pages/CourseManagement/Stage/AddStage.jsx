import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { displayErrorToast, displaySuccessToast } from "../../../../Utills/displayToasts";
import { manageStageApi } from "../../../../services/stage";

function AddStage({ closeWrapper, appendDataInAdd, data,id }) {

    const [formData, setFormData] = useState({
        name: "",
        image: "",
    })
    const [initialData, setInitialData] = useState({
        name: "",
        image: ""
    })
    const [submitForm, setSubmitForm] = useState(false)
    const [previewImage, setPreviewImage] = useState(null);
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
                const object = new FormData();

                if (imageChanged) {
                    object.append("stageImage", formData?.image);
                }

                try {
                    object.append("title", formData?.name);
                    object.append("stageId", data._id);
                    const submit = await manageStageApi(object)
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
                object.append("stageImage", formData?.image);
                object.append("title", formData?.name);
                object.append("course", id);
                const submit = await manageStageApi(object)
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
            setPreviewImage(data?.stageImage)
            setFormData({
                name: data.title,
                image: data.stageImage,
            })
            setInitialData({
                name: data.title,
                image: data.stageImage,
            })
        }
    }, [data])

    const validateForm = (data) => {
        let isValid = true;
        const newErrors = {};

        if (!data.name) {
            newErrors.name = "Title is required";
            isValid = false;
        }

        if (data.name) {
            if (data.name.length > 100) {
                newErrors.name = "Title should be less than 100 characters";
                isValid = false;
            }
        }

        if (!data.image) {
            newErrors.image = "Stage image is required";
            isValid = false;
        }

        if (typeof (data.image) === "object") {
            if (!data.image.type.includes("image")) {
                newErrors.image = "Only image should allowed";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const onChangeInputField = (e) => {
        const { name, value } = e.target
        if (submitForm) {
            validateForm({ ...formData, [name]: value.trimStart() })
        }
        setFormData({
            ...formData, [name]: value.trimStart()
        })
    }

    const onClickCrossIcon = () => {
        setPreviewImage(null);
        setFormData({ ...formData, image: "" });
    };

    const onClickPhoto = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
            setFormData({ ...formData, image: file });
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (submitForm) {
            validateForm(formData)
        }
    }, [formData])

    return (
        <div className="main-wrapper-fixed-position" onClick={() => closeWrapper(false)}>
            <div className="asa-main-wrapper-right" onClick={(e) => e.stopPropagation()}>
                <RxCross2 className="asa-cross-icon" size={20} onClick={() => closeWrapper(false)} />
                <div className="asa-header-design">{data?._id ? "Update Stage" : "Add Stage"}</div>
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
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter name"
                                        name="name"
                                        onChange={onChangeInputField}
                                        value={formData.name}
                                    />
                                    {errors?.name && (
                                        <div className="error-message">
                                            {errors?.name}
                                        </div>
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
                                                    onClick={() => onClickCrossIcon()}
                                                    className="cross-icon bg-primary"
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
                                                    Upload Image
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

                                <div className="d-grid mt-4">
                                    <button className="btn btn-primary" type="submit" disabled={loader}>{loader ? 'Processing..' : data?._id ? 'Update Course' : 'Add Course'}</button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>

        </div>
    )
}

export default AddStage