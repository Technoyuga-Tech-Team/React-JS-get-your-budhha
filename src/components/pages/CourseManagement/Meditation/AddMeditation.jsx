import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { displayErrorToast, displaySuccessToast } from "../../../../Utills/displayToasts";
import { manageMenidation } from "../../../../services/meditation";

function AddMeditation({ closeWrapper, appendDataInAdd, data, id }) {

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        femaleAudio: "",
        maleAudio: "",
    })
    const [initialData, setInitialData] = useState({
        name: "",
        description: "",
        image: "",
        femaleAudio: "",
        maleAudio: "",
    })
    const [submitForm, setSubmitForm] = useState(false)
    const [previewImage, setPreviewImage] = useState(null);
    const [previewMaleAudio, setPreviewMaleAudio] = useState(null);
    const [previewFemaleAudio, setPreviewFemaleAudio] = useState(null);
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
                let maleAudioChanged = initialData.maleAudio !== formData.maleAudio;
                let femaleAudioChanged = initialData.femaleAudio !== formData.femaleAudio;
                const object = new FormData();

                if (imageChanged) {
                    object.append("meditationImage", formData?.image);
                }
                if (maleAudioChanged) {
                    object.append("maleAudio", formData?.maleAudio);
                    // object.append("maleAudioDuration", formData?.maleAudioDuration);
                }
                if (femaleAudioChanged) {
                    object.append("femaleAudio", formData?.femaleAudio);
                    // object.append("femaleAudioDuration", formData?.femaleAudioDuration);
                }

                try {
                    object.append("meditationName", formData?.name);
                    object.append("description", formData?.description);
                    object.append("meditationId", data._id);
                    object.append("type", "course");
                    const submit = await manageMenidation(object)
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
                object.append("meditationImage", formData?.image);
                object.append("maleAudio", formData?.maleAudio);
                object.append("femaleAudio", formData?.femaleAudio);
                object.append("description", formData?.description);
                object.append("meditationName", formData?.name);
                object.append("type", "course");
                object.append("course", id.course);
                object.append("stage", id._id);
                //need to pass course and stage
                const submit = await manageMenidation(object)
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
            setPreviewImage(data?.meditationImage)
            setPreviewMaleAudio(data?.maleAudio)
            setPreviewFemaleAudio(data?.femaleAudio)
            setFormData({
                name: data.meditationName,
                description: data.description,
                image: data.meditationImage,
                femaleAudio: data.femaleAudio,
                maleAudio: data.maleAudio,
            })
            setInitialData({
                name: data.meditationName,
                description: data.description,
                image: data.meditationImage,
                femaleAudio: data.femaleAudio,
                maleAudio: data.maleAudio,
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
            if (data.description.length > 500) {
                newErrors.description = "Description should be less than 500 characters";
                isValid = false;
            }
        }

        if (!data.image) {
            newErrors.image = "image is required";
            isValid = false;
        }

        if (typeof (data.image) === "object") {
            if (!data.image.type.includes("image")) {
                newErrors.image = "Only image(jpeg) is allowed";
                isValid = false;
            }
        }

        if (!data.femaleAudio) {
            newErrors.femaleAudio = "Female Audio is required";
            isValid = false;
        }

        if (!data.maleAudio) {
            newErrors.maleAudio = "Male Audio is required";
            isValid = false;
        }

        if (typeof (data.femaleAudio) === "object") {
            if (!data.femaleAudio.type.includes("audio")) {
                newErrors.femaleAudio = "Only audio(mp3) is allowed";
                isValid = false;
            }
        }

        if (typeof (data.maleAudio) === "object") {
            if (!data.maleAudio.type.includes("audio")) {
                newErrors.maleAudio = "Only audio(mp3) is allowed";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const onChangeInputFeild = (e) => {
        const { name, value } = e.target
        if (submitForm) {
            validateForm({ ...formData, [name]: value.trimStart() })
        }
        setFormData({
            ...formData, [name]: value.trimStart()
        })
    }

    const onClickCrossIcon = (type) => {
        if (type === "img") {
            setPreviewImage(null);
            setFormData({ ...formData, image: "" });
        }
        else if (type === "female") {
            setPreviewFemaleAudio(null);
            setFormData({ ...formData, femaleAudio: "" });
        }
        else if (type === "male") {
            setPreviewMaleAudio(null);
            setFormData({ ...formData, maleAudio: "" });
        }
    };

    const onClickPhoto = async (e, type) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        if (type === "img") {
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData({ ...formData, image: file });
            };
            reader.readAsDataURL(file);
        }
        else if (type === "female") {
            reader.onloadend = () => {
                setPreviewFemaleAudio(reader.result);
                setFormData({ ...formData, femaleAudio: file });
            };
            reader.readAsDataURL(file);
        }
        else if (type === "male") {
            reader.onloadend = () => {
                setPreviewMaleAudio(reader.result);
                setFormData({ ...formData, maleAudio: file });
            };
            reader.readAsDataURL(file);
        }
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
                <div className="asa-header-design">{data?._id ? "Update Meditation" : "Add Meditation"}</div>
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
                                        onChange={onChangeInputFeild}
                                        value={formData?.description}>
                                    </textarea>
                                    {errors?.description && (
                                        <div className="error-message">
                                            {errors?.description}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    {previewFemaleAudio ? (
                                        <>
                                            <label
                                                className="form-label"
                                                htmlFor="photo"
                                                style={{ marginBottom: "0px" }}
                                            >
                                                Female Audio
                                            </label>
                                            <div className="image-container">
                                                <audio controls style={{ width: '265px' }}>
                                                    <source src={previewFemaleAudio} type="audio/ogg" />
                                                    <source src={previewFemaleAudio} type="audio/mpeg" />
                                                </audio>
                                                <div
                                                    onClick={() => onClickCrossIcon("female")}
                                                    className="cross-icon bg-primary"
                                                    style={{ marginTop: '-20px' }}
                                                >
                                                    <RxCross2
                                                        color="#fff"
                                                        size={20}
                                                    />
                                                </div>
                                                {errors?.femaleAudio && (
                                                    <div className="error-message">
                                                        {errors?.femaleAudio}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                accept="audio/*"
                                                id="photo"
                                                name="photo"
                                                type="file"
                                                onChange={(event) =>
                                                    onClickPhoto(event, "female")
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
                                                    Upload Female Audio
                                                </label>
                                            </button>
                                            {errors?.femaleAudio && (
                                                <div className="error-message">
                                                    {errors?.femaleAudio}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="mb-4">
                                    {previewMaleAudio ? (
                                        <>
                                            <label
                                                className="form-label"
                                                htmlFor="photo"
                                                style={{ marginBottom: "0px" }}
                                            >
                                                Male Audio
                                            </label>
                                            <div className="image-container">
                                                <audio controls style={{ width: '265px' }}>
                                                    <source src={previewMaleAudio} type="audio/ogg" />
                                                    <source src={previewMaleAudio} type="audio/mpeg" />
                                                </audio>
                                                <div
                                                    onClick={() => onClickCrossIcon("male")}
                                                    style={{ marginTop: '-20px' }}
                                                    className="cross-icon bg-primary"
                                                >
                                                    <RxCross2
                                                        color="#fff"
                                                        size={20}
                                                    />
                                                </div>
                                                {errors?.maleAudio && (
                                                    <div className="error-message">
                                                        {errors?.maleAudio}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                accept="audio/*"
                                                id="photo"
                                                name="photo"
                                                type="file"
                                                onChange={(event) =>
                                                    onClickPhoto(event, "male")
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
                                                    Upload Male Audio
                                                </label>
                                            </button>
                                            {errors?.maleAudio && (
                                                <div className="error-message">
                                                    {errors?.maleAudio}
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
                                    <button className="btn btn-primary" type="submit" disabled={loader}>{loader ? 'Processing..' : data?._id ? 'Update Meditation' : 'Add Meditation'}</button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>

        </div>
    )
}

export default AddMeditation