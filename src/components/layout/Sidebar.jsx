import { NavLink } from "react-router-dom"
import { BiSolidDashboard } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { TbMoodPlus } from "react-icons/tb";
import { PiFlowerLotusDuotone } from "react-icons/pi";
import "./Sidebar.css"
import { useSelector } from "react-redux";
// import { userRoleTypeForSuper } from "../../constant/constanant";
import { SiDecapcms } from "react-icons/si"

const navBarConst = [
    {
        key: 1,
        value: "Dashboard",
        icon: <BiSolidDashboard className="sidebar-icons" />,
        route: "/dashboard"
    },
    // {
    //     key: 2,
    //     value: "Theme",
    //     icon: <MdCategory className="sidebar-icons" />,
    //     route: "/category"
    // },
    // {
    //     key: 3,
    //     value: "Mood",
    //     icon: <TbMoodPlus className="sidebar-icons" />,
    //     route: "/mood"
    // },
    // {
    //     key: 4,
    //     value: "Meditation",
    //     icon: <PiFlowerLotusDuotone className="sidebar-icons" />,
    //     route: "/meditation"
    // },
    {
        key: 2,
        value: "CMS",
        icon: <SiDecapcms className="sidebar-icons" />,
        route: "/cms-management"
    },
    {
        key: 3,
        value: "Setting",
        icon: <IoMdSettings className="sidebar-icons" />,
        route: "/setting"
    },
]

const Sidebar = () => {
    const userRoleType = useSelector((state) => state.headerReducer?.useData)
    const getTypeData = localStorage.getItem("USER_TYPE_ADMIN")
    // let sideBarData = (getTypeData || userRoleType?.type) == userRoleTypeForSuper ? navBarConst : navBarConst?.filter((d) => {
    //     return d?.route !== "/sub-admin"
    // })

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
                            navBarConst?.map((nav) => {
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