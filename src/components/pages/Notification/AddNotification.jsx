import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts";
import { addNotification } from "../../../services/notification"

function AddNotification({ closeWrapper, appendDataInAdd }) {

    const [formData, setFormData] = useState({
        title: "",
        desc: "",
    })
    const [submitForm, setSubmitForm] = useState(false)
    const [loader, setLoader] = useState(false)
    const [errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoader(true);
        setSubmitForm(true)
        try {
            const isValidate = validateForm(formData)
            if (isValidate) {
                const object = {
                    title: formData?.title,
                    description: formData?.desc,
                }
                const submit = await addNotification(object)
                if (submit?.success) {
                    displaySuccessToast(submit?.message || "Data added successfully");
                    closeWrapper(false)
                    appendDataInAdd()
                }
                else {
                    displayErrorToast(submit?.message || "something went wrong while adding data")
                }
            }
        } catch (error) {
            displayErrorToast(error?.message || "something went wrong while adding data")
        }
        setLoader(false);
    }

    const validateForm = (data) => {
        let isValid = true;
        const newErrors = {};

        if (!data.title) {
            newErrors.title = "Title is required";
            isValid = false;
        }

        if (data.title) {
            if (data.title.length > 100) {
                newErrors.title = "Title should be less than 100 characters";
                isValid = false;
            }
        }

        if (!data.desc) {
            newErrors.desc = "Description is required";
            isValid = false;
        }

        if (data.desc) {
            if (data.desc.length > 500) {
                newErrors.desc = "Description should be less than 500 characters";
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

    return (
        <div className="main-wrapper-fixed-position">
            <div className="asa-main-wrapper-right" onClick={(e) => e.stopPropagation()}>
                <RxCross2 className="asa-cross-icon" size={20} onClick={() => closeWrapper(false)} />
                <div className="asa-header-design">Add Notification</div>
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
                                        placeholder="Enter title"
                                        name="title"
                                        onChange={onChangeInputFeild}
                                        value={formData.title}
                                    />
                                    {errors?.title && (
                                        <div className="error-message">
                                            {errors?.title}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="form-label"
                                        htmlFor="name"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter description"
                                        name="desc"
                                        onChange={onChangeInputFeild}
                                        value={formData.desc}
                                    />
                                    {errors?.desc && (
                                        <div className="error-message">
                                            {errors?.desc}
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid mt-4">
                                    <button className="btn btn-primary" type="submit" disabled={loader}>{loader ? 'Processing..' : 'Add Notification'}</button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>

        </div>
    )
}

export default AddNotification