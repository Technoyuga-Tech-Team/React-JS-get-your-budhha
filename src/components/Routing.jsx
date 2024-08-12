import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import DashBoard from "./pages/DashboardManagement/Dashboard";
import Setting from "./pages/Settings/Setting";
import CMSMangement from "./pages/CMSManagement/cmsManagement";
import Category from "./pages/CategoryManagement/Category";
import Mood from "./pages/MoodManagement/Mood";
import { Toaster } from "react-hot-toast";
import Meditation from "./pages/MeditationManagement/Meditation";
import BackGroundMusic from "./pages/BackGroundMusic/BackGroundMusic";
import UserList from "./pages/Users/UserList";
import ViewFeedback from "./pages/MeditationManagement/viewFeedback";
import Course from "./pages/CourseManagement/Course/Course";
import Stage from "./pages/CourseManagement/Stage/Stage";
import Meditation2 from "./pages/CourseManagement/Meditation/Meditation";

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
          <Route path="/user" element={<UserList />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/cms-management" element={<CMSMangement />} />
          <Route path="/theme" element={<Category />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/feedback-list" element={<ViewFeedback />} />
          <Route path="/backgroundMusic" element={<BackGroundMusic />} />
          <Route path="/course" element={<Course />} />
          <Route path="/stage" element={<Stage />} />
          <Route path="/course-meditation" element={<Meditation2 />} />
        </Routes>
      }
    </>
  )
}

export default Routing
