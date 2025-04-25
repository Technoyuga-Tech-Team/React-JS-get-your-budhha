import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { displayErrorToast, displaySuccessToast } from "../../../../Utills/displayToasts";
import { manageCourseApi } from "../../../../services/course";

function AddCourse({ closeWrapper, appendDataInAdd, data }) {

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        is_free: true,
    })
    const [initialData, setInitialData] = useState({
        name: "",
        description: "",
        image: "",
        is_free: true,
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
                    object.append("courseImage", formData?.image);
                }

                try {
                    object.append("name", formData?.name);
                    object.append("description", formData?.description);
                    object.append("is_free", formData?.is_free);
                    object.append("courseId", data._id);
                    const submit = await manageCourseApi(object)
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
                object.append("courseImage", formData?.image);
                object.append("description", formData?.description);
                object.append("name", formData?.name);
                object.append("is_free", formData?.is_free);
                const submit = await manageCourseApi(object)
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
            setPreviewImage(data?.courseImage)
            setFormData({
                name: data.name,
                description: data.description,
                image: data.courseImage,
                is_free: data.is_free,
                // femaleAudioDuration: data.femaleAudioDuration,
                // maleAudioDuration: data.maleAudioDuration
            })
            setInitialData({
                name: data.name,
                description: data.description,
                image: data.courseImage,
                is_free: data.is_free,
                // femaleAudioDuration: data.femaleAudioDuration,
                // maleAudioDuration: data.maleAudioDuration
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

        if (!data.description) {
            newErrors.description = "Description is required";
            isValid = false;
        }

        if (data.description) {
            if (data.description.length > 300) {
                newErrors.description = "Description should be less than 300 characters";
                isValid = false;
            }
        }

        if (!data.image) {
            newErrors.image = "image is required";
            isValid = false;
        }

        if (typeof (data.image) === "object") {
            if (!data.image.type.includes("image")) {
                newErrors.image = "Only image should allowed";
                isValid = false;
            }
        }

        if (data.is_free === undefined) {
            newErrors.is_free = "Is free is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const onChangeInputField = (e) => {
        const { name, value } = e.target;
        if (name === "is_free") {
            if (submitForm) {
                validateForm({ ...formData, [name]: value === "true" });
            }
            setFormData({
                ...formData, [name]: value === "true"
            });
        } else {
            const newValue1 = value.trimStart();
            const newValue = newValue1.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
            if (submitForm) {
                validateForm({ ...formData, [name]: newValue.trimStart() });
            }
            setFormData({
                ...formData, [name]: newValue.trimStart()
            });
        }
    };

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
        <div className="main-wrapper-fixed-position">
            <div className="asa-main-wrapper-right" onClick={(e) => e.stopPropagation()}>
                <RxCross2 className="asa-cross-icon" size={20} onClick={() => closeWrapper(false)} />
                <div className="asa-header-design">{data?._id ? "Update Course" : "Add Course"}</div>
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
                                    <label
                                        className="form-label"
                                        htmlFor="description"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        id="description"
                                        placeholder="Enter description"
                                        name="description"
                                        onChange={onChangeInputField}
                                        value={formData?.description}>
                                    </textarea>
                                    {errors?.description && (
                                        <div className="error-message">
                                            {errors?.description}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Is Free</label>
                                    <div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="is_free"
                                                id="isFreeYes"
                                                value="true"
                                                checked={formData.is_free === true}
                                                onChange={onChangeInputField}
                                            />
                                            <label className="form-check-label" htmlFor="isFreeYes">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="is_free"
                                                id="isFreeNo"
                                                value="false"
                                                checked={formData.is_free === false}
                                                onChange={onChangeInputField}
                                            />
                                            <label className="form-check-label" htmlFor="isFreeNo">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                    {errors?.is_free && (
                                        <div className="error-message">
                                            {errors?.is_free}
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

export default AddCourse