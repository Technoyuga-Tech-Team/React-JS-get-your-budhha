import { useState } from "react"
import "./Setting.css"
import { changeProfilePassword } from "../../../services/profile"
import { displayErrorToast, displaySuccessToast } from "../../../Utills/displayToasts"
function Password() {
    const [formData, setFormData] = useState({
        oldPass: "",
        newPass: "",
        confirmNewPass: ""
    })

    const [passwordType, setPasswordType] = useState({
        oldPass: "password",
        newPass: "password",
        confirmNewPass: "password"
    })
    const [submitForm, setSubmitForm] = useState(false)

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        if (submitForm) {
            validateForm({ ...formData, [name]: value.trim() })
        }
        setFormData({ ...formData, [name]: value.trim() })
    }

    const validateForm = (data) => {
        let isValid = true;
        const newErrors = {};

        if (!data.oldPass) {
            newErrors.oldPass = "old password is required";
            isValid = false;
        }
        if (!data.newPass) {
            newErrors.newPass = "new password is required";
            isValid = false;
        }
        if (!data.confirmNewPass) {
            newErrors.confirmNewPass = "confirm New password is required";
            isValid = false;
        }

        if (data?.newPass !== data?.confirmNewPass) {
            newErrors.confirmNewPass = "new password and confirm password should same"
            isValid = false;
        }

        const passValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        if (data?.newPass) {
            if (data?.newPass?.length < 8 || !(passValidation.test(data?.newPass))) {
                newErrors.newPass = "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const onClickEyeIcon = async (data) => {
        setPasswordType({
            ...passwordType,
            [data]: passwordType[data] === "password" ? "text"
                : "password"
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitForm(true)
        const isValid = validateForm(formData)
        if (isValid) {
            const data = {
                oldPassword: formData?.oldPass,
                newPassword: formData?.newPass
            }
            const changePass = await changeProfilePassword(data)
            console.log(changePass)
            if (changePass?.success) {
                setSubmitForm(false)
                setFormData({
                    oldPass: "",
                    newPass: "",
                    confirmNewPass: ""
                })
                displaySuccessToast(changePass?.message || "password updated successfully")
            }
            else {
                // setFormData({
                //     oldPass: "",
                //     newPass: "",
                //     confirmNewPass: ""
                // })
                displayErrorToast(changePass?.message || "something went wrong while updating password")
            }
        }
    }

    const onClickCencleButtonClick = () => {
        setFormData({
            oldPass: "",
            newPass: "",
            confirmNewPass: ""
        })
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
                                    <div className="asa-header-design">Password</div>
                                    <form className="form-horizontal"
                                        style={{ marginTop: "35px" }}
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-4 password">
                                                    <label className="form-label" htmlFor="username">
                                                        Current password
                                                    </label>
                                                    <div className="input-with-icon-label">
                                                        <input
                                                            type={passwordType?.oldPass}
                                                            className="form-control"
                                                            id="oldPass"
                                                            placeholder="Enter old password"
                                                            name="oldPass"
                                                            onChange={handleChange}
                                                            value={formData?.oldPass}
                                                        />
                                                        <img
                                                            className="input-with-icon-design"
                                                            onClick={() => onClickEyeIcon("oldPass")}
                                                            src={
                                                                passwordType?.oldPass === "password"
                                                                    ? "/images/eye-slash.png" : "/images/eye.png"
                                                            }
                                                        />
                                                    </div>
                                                    {errors?.oldPass && (
                                                        <div className="error-message">
                                                            {errors?.oldPass}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-4 password">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="userpassword"
                                                    >
                                                        New Password
                                                    </label>
                                                    <div className="input-with-icon-label">
                                                        <input
                                                            type={passwordType?.newPass}
                                                            className="form-control"
                                                            id="newPass"
                                                            placeholder="Enter new password"
                                                            name="newPass"
                                                            onChange={handleChange}
                                                            value={formData?.newPass}
                                                        />
                                                        <img
                                                            className="input-with-icon-design"
                                                            onClick={() => onClickEyeIcon("newPass")}
                                                            src={
                                                                passwordType?.newPass === "password"
                                                                    ? "/images/eye-slash.png" : "/images/eye.png"
                                                            }
                                                        />
                                                    </div>
                                                    {errors?.newPass && (
                                                        <div className="error-message">
                                                            {errors?.newPass}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-4 password">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="userpassword"
                                                    >
                                                        Confirm New Password
                                                    </label>
                                                    <div className="input-with-icon-label">
                                                        <input
                                                            type={passwordType?.confirmNewPass}
                                                            className="form-control"
                                                            id="confirmNewPass"
                                                            placeholder="Confirm new password"
                                                            name="confirmNewPass"
                                                            onChange={handleChange}
                                                            value={formData?.confirmNewPass}
                                                        />
                                                        <img
                                                            className="input-with-icon-design"
                                                            onClick={() => onClickEyeIcon("confirmNewPass")}
                                                            src={
                                                                passwordType?.confirmNewPass === "password"
                                                                    ? "/images/eye-slash.png" : "/images/eye.png"
                                                            }
                                                        />
                                                    </div>
                                                    {errors?.confirmNewPass && (
                                                        <div className="error-message">
                                                            {errors?.confirmNewPass}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-4" style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <button
                                                        style={{ width: "40%", border: "1px solid #ced4da" }}
                                                        className="btn waves-effect waves-light"
                                                        type="button"
                                                        onClick={() => onClickCencleButtonClick()}
                                                    >
                                                        Cancle
                                                    </button>
                                                    <button
                                                        style={{ width: "50%" }}
                                                        className="btn btn-primary waves-effect waves-light"
                                                        type="submit"
                                                    >
                                                        Update Password
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Password