import { useState } from "react";
import toast from "react-hot-toast";
const PIE_API_URL = import.meta.env.VITE_REACT_API_URL;
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const validation = () => {
        let errors = {};
        if (!email) {
            errors['email_err'] = 'Please enter email address';
            toast.error('Please enter email address', { style: { background: '#333', color: '#fff' } })
        }
        else if (typeof email !== "undefined") {
            let lastAtPos = email.lastIndexOf('@');
            let lastDotPos = email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') === -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
                errors['email_err'] = "Email is not valid";
                toast.error('Email is not valid', { style: { background: '#333', color: '#fff' } })
            }
        }
        return (Object.keys(errors).length > 0) ? false : true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validation()) {
            setDisable(true);
            var bodyParameter = new URLSearchParams();
            bodyParameter.append('email', email);
            await axios({
                method: 'post',
                url: `${PIE_API_URL}/admin/v1/forget-password`,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: bodyParameter
            }).then((response) => {
                console.log(response?.data)
                if (response?.data?.success) {
                    setEmail('');
                    toast.success(response?.data?.message, { style: { background: '#333', color: '#fff' } })
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
                                        <h4 className="font-size-18 text-muted mt-2 text-center">Forgot Password</h4>
                                        <form className="form-horizontal" style={{ marginTop: '35px' }} onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="alert alert-warning alert-dismissible">
                                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
                                                        Enter your <b>Email</b> and instructions will be sent to you!
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="form-label" htmlFor="username">Email</label>
                                                        <input type="text" className="form-control" id="username" placeholder="Enter email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                                                    </div>
                                                    <div className="d-grid mt-4">
                                                        <button className="btn btn-primary waves-effect waves-light" type="submit" onClick={handleSubmit} disabled={disable}>{disable ? 'Sending..' : 'Send Mail'}</button>
                                                        <p style={{ margin: 'auto', marginTop: "7px", cursor: "pointer", color: "#278BD0", textDecoration: "underline" }} onClick={() => { navigate('/') }}>Login</p>
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

export default ForgotPassword