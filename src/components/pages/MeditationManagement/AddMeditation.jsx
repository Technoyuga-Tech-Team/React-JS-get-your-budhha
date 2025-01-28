import { useEffect, useState, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts";
import { manageMenidation } from "../../../services/meditation"
import DropdownComponent from "../../../component/DropDown/Dropdown";
import { getthemeApi } from "../../../services/theme";
import { getmoodApi } from "../../../services/mood";

function AddMeditation({ closeWrapper, appendDataInAdd, data }) {

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        theme: "",
        // moods: "",
        image: "",
        femaleAudio: "",
        maleAudio: "",
        maleAudioDuration: "",
        femaleAudioDuration: "",
        dailyMeditation: false
    })
    const [initialData, setInitialData] = useState({
        name: "",
        description: "",
        theme: "",
        // moods: "",
        image: "",
        femaleAudio: "",
        maleAudio: "",
        maleAudioDuration: "",
        femaleAudioDuration: "",
        dailyMeditation: false
    })
    const [submitForm, setSubmitForm] = useState(false)
    const [previewImage, setPreviewImage] = useState(null);
    const [previewMaleAudio, setPreviewMaleAudio] = useState(null);
    const [previewFemaleAudio, setPreviewFemaleAudio] = useState(null);
    const [themeDropDown, setThemeDropDown] = useState([]);
    // const [moodDropDown, setMoodDropDown] = useState([]);
    const [loader, setLoader] = useState(false)
    const [errors, setErrors] = useState({})
    const femaleAudioRef = useRef(null);
    const maleAudioRef = useRef(null);
    const [currentAudio, setCurrentAudio] = useState(null);

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
                    formData?.maleAudio ? object.append("maleAudio", formData?.maleAudio) : object.append("isDeleteMaleAudio", true);
                    // object.append("maleAudioDuration", formData?.maleAudioDuration);
                }
                if (femaleAudioChanged) {
                    formData?.femaleAudio ? object.append("femaleAudio", formData?.femaleAudio) : object.append("isDeleteFemaleAudio", true);
                    // object.append("femaleAudioDuration", formData?.femaleAudioDuration);
                }

                try {
                    object.append("meditationName", formData?.name);
                    object.append("description", formData?.description);
                    object.append("meditationId", data._id);
                    object.append("theme", formData?.theme?.value?.toString());
                    // object.append("moods", JSON.stringify(formData?.moods?.map(mood => mood.value)));
                    object.append("type", "theme");
                    object.append("dailyMeditation", formData?.dailyMeditation);

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
                object.append("maleAudio", formData?.maleAudio || null);
                object.append("femaleAudio", formData?.femaleAudio || null);
                object.append("description", formData?.description);
                object.append("meditationName", formData?.name);
                object.append("femaleAudioDuration", formData?.femaleAudioDuration);
                object.append("maleAudioDuration", formData?.maleAudioDuration);
                object.append("theme", formData?.theme?.value?.toString());
                object.append("dailyMeditation", formData?.dailyMeditation);
                // object.append("moods", JSON.stringify(formData?.moods?.map(mood => mood.value)));
                object.append("type", "theme");
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
                theme: { value: data.theme._id, label: data.theme.name },
                dailyMeditation: data.dailyMeditation,
                // moods: data.moods.map(mood => ({ value: mood._id, label: mood.name })),
                // femaleAudioDuration: data.femaleAudioDuration,
                // maleAudioDuration: data.maleAudioDuration
            })
            setInitialData({
                name: data.meditationName,
                description: data.description,
                image: data.meditationImage,
                femaleAudio: data.femaleAudio,
                maleAudio: data.maleAudio,
                theme: { value: data.theme._id, label: data.theme.name },
                dailyMeditation: data.dailyMeditation,
                // moods: data.moods.map(mood => ({ value: mood._id, label: mood.name })),
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
            if (data.description.length > 500) {
                newErrors.description = "Description should be less than 500 characters";
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

        if (!data.theme) {
            newErrors.theme = "Theme is required";
            isValid = false;
        }

        // if (data?.moods?.length < 1) {
        //     newErrors.moods = "Mood is required";
        //     isValid = false;
        // }

        // if (!data.femaleAudio) {
        //     newErrors.femaleAudio = "Female Audio is required";
        //     isValid = false;
        // }

        // if (!data.maleAudio) {
        //     newErrors.maleAudio = "Male Audio is required";
        //     isValid = false;
        // }

        if (data.femaleAudio && typeof (data.femaleAudio) === "object") {
            if (!data.femaleAudio.type.includes("audio")) {
                newErrors.femaleAudio = "Only audio(mp3) is allowed";
                isValid = false;
            }
        }

        if (data.maleAudio && typeof (data.maleAudio) === "object") {
            if (!data.maleAudio.type.includes("audio")) {
                newErrors.maleAudio = "Only audio(mp3) is allowed";
                isValid = false;
            }
        }

        if (!data.femaleAudio && !data.maleAudio) {
            newErrors.maleAudio = "Atleast one audio is required";
            newErrors.femaleAudio = "Atleast one audio is required";
            isValid = false;
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

    const onChangeDropDownValue = (data, type) => {
        if (type === "theme") {
            setFormData({
                ...formData, theme: data
            })
        } else {
            // setFormData({
            //     ...formData, moods: data
            // })
        }
    }

    const handleAudioPlay = (audioType) => {
        const audioElement = audioType === "female" ? femaleAudioRef.current : maleAudioRef.current;

        if (currentAudio && currentAudio !== audioElement) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        setCurrentAudio(audioElement);
        audioElement.play();
    };



    return (
        <div className="main-wrapper-fixed-position">
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
                                    <label className="form-label" htmlFor="username">
                                        Select Theme
                                    </label>
                                    <DropdownComponent
                                        width={"100%"}
                                        options={themeDropDown}
                                        onChange={(value) => onChangeDropDownValue(value, "theme")}
                                        defaultVal={themeDropDown && themeDropDown[0]}
                                        value={formData?.theme}
                                        placeholder="Select Theme"
                                        isDisabled={false}
                                        isMulti={false}
                                    />
                                    {errors?.theme && (
                                        <div className="error-message">
                                            {errors?.theme}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label" htmlFor="username">
                                        Daily Calm Meditation
                                    </label>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="SwitchCheck1"
                                            checked={formData.dailyMeditation} // Checked if Automatic (1)
                                            onChange={(e) => setFormData({ ...formData, dailyMeditation: e.target.checked })}
                                        />
                                        {/* <label className="form-check-label" htmlFor="SwitchCheck1">
                                            { ? "Show" : "Hide"}
                                        </label> */}
                                    </div>
                                </div>

                                {/* <div className="mb-4">
                                    <label className="form-label" htmlFor="username">
                                        Select Mood
                                    </label>
                                    <DropdownComponent
                                        width={"100%"}
                                        options={moodDropDown}
                                        onChange={(value) => onChangeDropDownValue(value, "moods")}
                                        defaultVal={moodDropDown && moodDropDown[0]}
                                        value={formData?.moods}
                                        placeholder="Select Moods"
                                        isDisabled={false}
                                        isMulti={true}
                                    />
                                    {errors?.moods && (
                                        <div className="error-message">
                                            {errors?.moods}
                                        </div>
                                    )}
                                </div> */}

                                <div className="mb-4">
                                    {previewFemaleAudio ? (
                                        <>
                                            <label
                                                className="form-label"
                                                htmlFor="photo1"
                                                style={{ marginBottom: "0px" }}
                                            >
                                                Female Audio
                                            </label>
                                            <div className="image-container">
                                                <audio ref={femaleAudioRef} style={{ width: '265px' }} src={previewFemaleAudio} controls onPlay={() => handleAudioPlay("female")} />
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
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                accept="audio/*"
                                                id="photo1"
                                                name="photo1"
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
                                                    htmlFor="photo1"
                                                >
                                                    Upload Female Audio
                                                </label>
                                            </button>

                                        </>
                                    )}
                                    {errors?.femaleAudio && (
                                        <div className="error-message">
                                            {errors?.femaleAudio}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    {previewMaleAudio ? (
                                        <>
                                            <label
                                                className="form-label"
                                                htmlFor="photo2"
                                                style={{ marginBottom: "0px" }}
                                            >
                                                Male Audio
                                            </label>
                                            <div className="image-container">
                                                <audio ref={maleAudioRef} src={previewMaleAudio} controls style={{ width: '265px' }} onPlay={() => handleAudioPlay("male")} />
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
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                accept="audio/*"
                                                id="photo2"
                                                name="photo2"
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
                                                    htmlFor="photo2"
                                                >
                                                    Upload Male Audio
                                                </label>
                                            </button>
                                        </>
                                    )}
                                    {errors?.maleAudio && (
                                        <div className="error-message">
                                            {errors?.maleAudio}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    {previewImage ? (
                                        <>
                                            <label
                                                className="form-label"
                                                htmlFor="photo3"
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
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                accept="image/*"
                                                id="photo3"
                                                name="photo3"
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
                                                    htmlFor="photo3"
                                                >
                                                    Upload Image
                                                </label>
                                            </button>
                                        </>
                                    )}
                                    {errors?.image && (
                                        <div className="error-message">
                                            {errors?.image}
                                        </div>
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