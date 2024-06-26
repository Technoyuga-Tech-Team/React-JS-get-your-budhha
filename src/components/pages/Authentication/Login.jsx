import axios from "axios";
import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";
const PIE_API_URL = import.meta.env.VITE_REACT_API_URL;
import toast from "react-hot-toast";

const Login = () => {
    const [details, setDetails] = useState({
        email: '',
        password: '',
    });
    const [passwordType, setPasswordType] = useState("password");
    const [disable, setDisable] = useState(false);
    const nav = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails({ ...details, [name]: value })
    }

    const validation = () => {
        let errors = {};
        for (let key in details) {
            if (!details[key]) {
                errors[key + '_err'] = 'Please enter ' + key.replace(/_/g, " ");
                toast.error('Please enter ' + key.replace(/_/g, " "), { style: { background: '#333', color: '#fff' } })
            }
            else if (key === "email") {
                if (typeof details[key] !== "undefined") {
                    let lastAtPos = details[key].lastIndexOf('@');
                    let lastDotPos = details[key].lastIndexOf('.');

                    if (!(lastAtPos < lastDotPos && lastAtPos > 0 && details[key].indexOf('@@') === -1 && lastDotPos > 2 && (details[key].length - lastDotPos) > 2)) {
                        errors['email_err'] = "Email is not valid";
                        toast.error('Email is not valid', { style: { background: '#333', color: '#fff' } })
                    }
                }
            }
        }
        return (Object.keys(errors).length > 0) ? false : true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validation()) {
            setDisable(true);
            var bodyParameter = new URLSearchParams();
            bodyParameter.append('email', details?.email);
            bodyParameter.append('password', details?.password);
            await axios({
                method: 'post',
                url: `${PIE_API_URL}/admin/v1/login`,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: bodyParameter
            }).then((response) => {
                console.log(response?.data)
                if (response?.data?.success) {
                    toast.success(response?.data?.message, { style: { background: '#333', color: '#fff' } })
                    localStorage.setItem("PIE_ADMIN_TOKEN", response?.data?.data);
                    <Navigate to="/dashboard" />
                    window.location.reload();
                } else {
                    toast.error(response?.data?.message, { style: { background: '#333', color: '#fff' } })
                }
            }).catch((error) => {
                toast.error(error?.response?.data?.message, { style: { background: '#333', color: '#fff' } })
            })
            setDisable(false);
        }
    }

    return (
        <div style={{ backgroundColor: 'white', height: "100vh" }}>
            {/* <div className="bg-overlay" /> */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-4 col-lg-6 col-md-8">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className>
                                        <div className="text-center">
                                            <img src="/images/buddha.png" alt height={50} className="auth-logo logo-dark mx-auto" />
                                            <b><p>Ease</p></b>
                                        </div>
                                        {/* <h4 className="font-size-18 text-muted mt-2 text-center">Welcome Back !</h4> */}
                                        <form className="form-horizontal" style={{ marginTop: '35px' }} onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="mb-4">
                                                        <label className="form-label" htmlFor="username">Email</label>
                                                        <input type="text" className="form-control" id="username" placeholder="Enter email" name="email" onChange={handleChange} value={details?.email} />
                                                    </div>
                                                    <div className="mb-4 password">
                                                        <label className="form-label" htmlFor="userpassword">Password</label>
                                                        <input type={passwordType} className="form-control" id="userpassword" placeholder="Enter password" name="password" onChange={handleChange} value={details?.password} />
                                                        <img className="eye-icon"
                                                            onClick={() => {
                                                                setPasswordType(passwordType === "password" ? "text" : "password");
                                                            }} src={passwordType === 'password' ? "/images/eye-slash.png" : "/images/eye.png"} />
                                                    </div>
                                                    <div className="row">
                                                        <div className="col">
                                                            {/* <div className="form-check">
                                                                <input type="checkbox" className="form-check-input" id="customControlInline" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                                                                <label className="form-label" htmlFor="customControlInline">Remember me</label>
                                                            </div> */}
                                                        </div>
                                                        <div className="col-7">
                                                            <div className="text-md-end mt-3 mt-md-0">
                                                                <a href="/forgot-password" className="text-muted"><i className="mdi mdi-lock" /> Forgot your password?</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-grid mt-4">
                                                        <button className="btn btn-primary waves-effect waves-light" type="submit" onClick={handleSubmit} disabled={disable}>{disable ? 'Processing..' : 'Log In'}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login