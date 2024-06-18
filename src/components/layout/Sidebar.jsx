import { NavLink } from "react-router-dom"
import { BiSolidDashboard } from "react-icons/bi";
import { RiMessage2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";
import { TbArticleFilledFilled } from "react-icons/tb";
import { MdOutlineInterests } from "react-icons/md";
import "./Sidebar.css"
import { useSelector } from "react-redux";
import { userRoleTypeForSuper } from "../../constant/constanant";
import { SiDecapcms } from "react-icons/si"
import { FaUser } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";

const navBarConst = [
    {
        key: 1,
        value: "Dashboard",
        icon: <BiSolidDashboard className="sidebar-icons" />,
        route: "/dashboard"
    },
    {
        key: 2,
        value: "Fits & Intrest",
        icon: <MdOutlineInterests className="sidebar-icons" />,
        route: "/fits&intrest"
    },
    {
        key: 3,
        value: "Gun Reviews",
        icon: <RiMessage2Fill className="sidebar-icons" />,
        route: "/gun-reviews"
    },
    {
        key: 4,
        value: "Sub Admin",
        icon: <RiAdminFill className="sidebar-icons" />,
        route: "/sub-admin"
    },
    {
        key: 5,
        value: "Articles And Event",
        icon: <TbArticleFilledFilled className="sidebar-icons" />,
        route: "/articles"
    },
    {
        key: 6,
        value: "User",
        icon: <FaUser className="sidebar-icons" />,
        route: "/user-list"
    },
    {
        key: 7,
        value: "Business User",
        icon: <FaUserShield className="sidebar-icons" />,
        route: "/bussiness-user-list"
    },
    {
        key: 8,
        value: "CMS",
        icon: <SiDecapcms className="sidebar-icons" />,
        route: "/cms-management"
    },
    {
        key: 9,
        value: "Setting",
        icon: <IoMdSettings className="sidebar-icons" />,
        route: "/setting"
    },
]

const Sidebar = () => {
    const userRoleType = useSelector((state) => state.headerReducer?.useData)
    const getTypeData = localStorage.getItem("USER_TYPE_ADMIN")
    let sideBarData = (getTypeData || userRoleType?.type) == userRoleTypeForSuper ? navBarConst : navBarConst?.filter((d) => {
        return d?.route !== "/sub-admin"
    })

    const onPressNavigationMenu = () => {
        if ($(window).width() < 992) {
            $('body').toggleClass('sidebar-enable');
            $('body').toggleClass('vertical-collpsed');
        }
    }

    return (
        <div className="vertical-menu">
            <div data-simplebar className="h-100">
                {/*- Sidemenu */}
                <div id="sidebar-menu">
                    {/* Left Menu Start */}
                    <ul className="metismenu list-unstyled" id="side-menu">
                        <li className="menu-title">Menu</li>
                        {
                            sideBarData?.map((nav) => {
                                return (
                                    <li key={nav?.key}>
                                        <NavLink to={nav?.route} onClick={() => onPressNavigationMenu()} className="waves-effect" activeClassName="active-link">
                                            {nav?.icon}
                                            <span>{nav?.value}</span>
                                        </NavLink>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                {/* Sidebar */}
            </div>
        </div>
    )
}

export default Sidebar