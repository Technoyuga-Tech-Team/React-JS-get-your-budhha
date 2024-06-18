import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLoggedinUserProfile } from "../../services/profile";
import { displayErrorToast } from "../../Utills/displayToasts";
import { useDispatch, useSelector } from "react-redux";
import { getUserDataAction } from "../../ReduxStore/Actions/header";
import _ from "lodash"
const Header = () => {
    const nav = useNavigate();
    const dispatch = useDispatch()
    const userData = useSelector((state) => state?.headerReducer)
    const handleLogout = () => {
        nav("/");
        localStorage.removeItem("PIE_ADMIN_TOKEN");
    }
    const getUserProfile = async () => {
        const profileData = await getLoggedinUserProfile()
        if (profileData?.success) {
            dispatch(getUserDataAction(profileData?.data))
        }
        else {
            localStorage.clear()
            window.location.reload();
            displayErrorToast(profileData?.message || "something went wrong while get user profile")
        }
    }
    useEffect(() => {
        if (_.isEmpty(userData?.useData)) {
            getUserProfile()
        }
    }, [])

    const onClickVerticalMenu = () => {
        $('body').toggleClass('sidebar-enable');
        if ($(window).width() >= 992) {
            $('body').toggleClass('vertical-collpsed');
        } else {
            $('body').removeClass('vertical-collpsed');
        }
    };


    return (
        <header id="page-topbar">
            <div className="navbar-header">
                <div className="d-flex">
                    {/* LOGO */}
                    <div className="navbar-brand-box text-center">
                        <Link className="logo logo-dark" to={"/dashboard"}>
                            <span className="logo-sm">
                                <img src="/images/favicon.svg" alt="logo-sm-dark" height={40} />
                            </span>
                            <span className="logo-lg">
                                <img src="/images/logo-dark.svg" alt="logo-dark" height={40} />
                            </span>
                        </Link>
                        <Link className="logo logo-light" to={"/dashboard"}>
                            <span className="logo-sm">
                                <img src="/images/logo-sm.png" alt="logo-sm-light" height={22} />
                            </span>
                            <span className="logo-lg">
                                <img src="/images/logo-light.png" alt="logo-light" height={24} />
                            </span>
                        </Link>
                    </div>
                    <button type="button" className="btn btn-sm px-3 font-size-24 header-item waves-effect" id="vertical-menu-btn" onClick={() => onClickVerticalMenu()}>
                        <i className="ri-menu-2-line align-middle" />
                    </button>
                </div>
                <div className="d-flex">

                    <div className="dropdown d-inline-block user-dropdown">
                        <button type="button" className="btn header-item waves-effect" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img className="rounded-circle header-profile-user" src={userData?.useData?.profile_pic ? userData?.useData?.profile_pic : "/images/users/dummy-avtar.png"} alt="Header Avatar" />
                            <span className="d-none d-xl-inline-block ms-1">{userData?.useData?.name}</span>
                            <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-end">
                            <Link className="dropdown-item" to="/setting"><i className="ri-user-line align-middle me-1" /> Profile</Link>
                            <div className="dropdown-divider" />
                            <a className="dropdown-item text-danger" href="" onClick={() => handleLogout()}><i className="ri-shut-down-line align-middle me-1 text-danger" /> Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header