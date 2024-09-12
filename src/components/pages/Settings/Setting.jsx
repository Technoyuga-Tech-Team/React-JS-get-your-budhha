import { useState } from "react";
import TabBarDesign from "../../../component/Tab/Tab";
import Profile from "./Profile";
import Password from "./Passward";
import Header from "../../layout/Header";
import Sidebar from "../../layout/Sidebar";

const tabConst = [
  { key: 1, value: "Profile" },
  { key: 2, value: "Password" },
]
function Settings() {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  return (
    <>
      <div data-sidebar="dark">
        <div id="layout-wrapper">
          <Header />
          <Sidebar />
          <div className="main-content" style={{ minHeight: "100vh" }}>
            <div className="page-content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                      <h4 className="mb-sm-0">Setting</h4>
                      <div className="page-title-right">
                        <ol className="breadcrumb m-0">
                          <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                          <li className="breadcrumb-item active">Setting</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <TabBarDesign
                    onClick={(data) => handleTabClick(data)}
                    activeTab={activeTab}
                    data={tabConst} />
                </div>
                <div className="set-tab-design-main-wrap">
                  {activeTab === 1 ?
                    <Profile />
                    : activeTab === 2 ?
                      <Password />
                      : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
