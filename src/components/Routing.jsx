import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import DashBoard from "./pages/DashboardManagement/Dashboard";
import Setting from "./pages/Settings/Setting";
import CMSMangement from "./pages/CMSManagement/cmsManagement";
import Category from "./pages/CategoryManagement/Category";
import Mood from "./pages/MoodManagement/Mood";
import { Toaster } from "react-hot-toast";

const Routing = () => {
  return (
    <>
      <Toaster />
      {!localStorage.getItem("PIE_ADMIN_TOKEN") ?
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        :
        <Routes>
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/cms-management" element={<CMSMangement />} />
          <Route path="/category" element={<Category />} />
          <Route path="/mood" element={<Mood />} />
        </Routes>
      }
    </>
  )
}

export default Routing
