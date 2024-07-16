import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts";
import { getBackGroundMusicApi, manageBackGroundMusic } from "../../../services/backGroundMusic";
const PIE_API_URL = import.meta.env.VITE_REACT_IMAGE_URL;

function AddBackGroundMusic({ closeWrapper, appendDataInAdd, data }) {
    console.log(data)

    const [formData, setFormData] = useState({
        name: "",
        audio: "",
        image: "",
    })
    const [initialData, setInitialData] = useState({
        name: "",
        image: "",
        audio: "",
    })
    const [submitForm, setSubmitForm] = useState(false)
    const [previewImage, setPreviewImage] = useState(null);
    const [previewAudio, setpreviewAudio] = useState(null);
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
                let audioChanged = initialData.audio !== formData.audio;

                const object = new FormData();

                if (imageChanged) {
                    object.append("bgImage", formData?.image);
                }
                if (audioChanged) {
                    object.append("audio", formData?.audio);
                    // object.append("maleAudioDuration", formData?.maleAudioDuration);
                }

                try {
                    object.append("name", formData?.name);
                    object.append("bgId", data?._id);
                    const submit = await manageBackGroundMusic(object)
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
                object.append("name", formData?.name);
                object.append("audio", formData?.audio);
                object.append("bgImage", formData?.image);
                const submit = await manageBackGroundMusic(object)
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
            setPreviewImage(data?.bgImage)
            setpreviewAudio(data?.audio)
            setFormData({
                name: data?.name,
                audio: data?.audio,
                image: data?.bgImage,
            })
            setInitialData({
                name: data?.name,
                audio: data?.audio,
                image: data?.bgImage,
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
            newErrors.image = "image is required";
            isValid = false;
        }

        if (typeof (data.image) === "object") {
            if (!data.image.type.includes("image")) {
                newErrors.image = "Only image(jpeg) is allowed";
                isValid = false;
            }
        }

        if (!data.audio) {
            newErrors.audio = "Audio is required";
            isValid = false;
        }

        if (typeof (data.audio) === "object") {
            if (!data.audio.type.includes("audio")) {
                newErrors.femaleAudio = "Only audio(mp3) is allowed";
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
        else if (type === "audio") {
            setpreviewAudio(null);
            setFormData({ ...formData, audio: "" });
        }
    };

    // const onClickPhoto = async (e, type) => {
    //     const file = e.target.files[0];
    //     console.log("file ==================",);
    //     const reader = new FileReader();

    //     if (type === "img") {
    //         reader.onloadend = () => {
    //             setPreviewImage(reader.result);
    //             setFormData({ ...formData, image: file });
    //         };
    //         reader.readAsDataURL(file);
    //     }
    //     else if (type === "female" || type === "male") {
    //         reader.onloadend = () => {
    //             const audio = new Audio(reader.result);
    //             audio.onloadedmetadata = () => {
    //                 const duration = audio.duration * 1000;
    //                 if (type === "female") {
    //                     setPreviewFemaleAudio(reader.result);
    //                     setFormData({ ...formData, femaleAudio: file, femaleAudioDuration: duration });
    //                 }
    //                 else if (type === "male") {
    //                     setpreviewAudio(reader.result);
    //                     setFormData({ ...formData, maleAudio: file, maleAudioDuration: duration });
    //                 }
    //             };
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };


    const onClickPhoto = async (e, type) => {
        // console.log(type)
        const file = e.target.files[0];
        const reader = new FileReader();
        if (type === "img") {
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData({ ...formData, image: file });
            };
            reader.readAsDataURL(file);
        }
        else if (type === "audio") {
            reader.onloadend = () => {
                setpreviewAudio(reader.result);
                setFormData({ ...formData, audio: file });
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
                <div className="asa-header-design">{data?._id ?
                    <>
                        Update Background<br /> Music
                    </> :
                    <>
                        Add Background <br /> Music
                    </>
                }</div>
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
                                    {previewAudio ? (
                                        <>
                                            <label
                                                className="form-label"
                                                htmlFor="photo"
                                                style={{ marginBottom: "0px" }}
                                            >
                                                Background Music
                                            </label>
                                            <div className="image-container">
                                                <audio controls style={{ width: '265px' }}>
                                                    <source src={previewAudio} type="audio/ogg" />
                                                    <source src={previewAudio} type="audio/mpeg" />
                                                </audio>
                                                <div
                                                    onClick={() => onClickCrossIcon("audio")}
                                                    className="cross-icon bg-primary"
                                                    style={{ marginTop: '-20px' }}
                                                >
                                                    <RxCross2
                                                        color="#fff"
                                                        size={20}
                                                    />
                                                </div>
                                                {errors?.audio && (
                                                    <div className="error-message">
                                                        {errors?.audio}
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
                                                    onClickPhoto(event, "audio")
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
                                                    Upload Backgroud Music
                                                </label>
                                            </button>
                                            {errors?.audio && (
                                                <div className="error-message">
                                                    {errors?.audio}
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
                                    <button className="btn btn-primary" type="submit" disabled={loader}>{loader ? 'Processing..' : data?._id ? 'Update' : 'Add'}</button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>

        </div>
    )
}

export default AddBackGroundMusic