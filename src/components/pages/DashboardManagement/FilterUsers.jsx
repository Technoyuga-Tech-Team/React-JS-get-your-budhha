import { useState } from "react";
import DropdownComponent from "../../../component/DropDown/Dropdown"
import { SexualityDropdownConst, ageGroupDropdownConst, genderDropdownConst, languageDropdownConst } from "../../../constant/dropdownConst"
import "./Dashboard.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function FilterUsers() {
    const [filter, setFilter] = useState({
        date: { startDate: "", endDate: "" }
    })



    const onChangeDateValue = (data, key) => {
        console.log("data ===============", data);
        if (key === "startDate") {
            setFilter({
                ...filter,
                date: { endDate: data, [key]: data }
            })
        } else {
            setFilter({
                ...filter,
                date: { ...filter?.date, [key]: data }
            })
        }
    }

    console.log("filter =======", filter);


    return (
        <>
            <div className="ul-dashboard-drop-down">
                <label style={{ textAlign: "center" }}>Age Group</label>
                <DropdownComponent
                    options={ageGroupDropdownConst} />
            </div>
            <div className="ul-dashboard-drop-down">
                <label style={{ textAlign: "center" }}>Gender</label>
                <DropdownComponent
                    options={genderDropdownConst} />
            </div>
            <div className="ul-dashboard-drop-down">
                <label style={{ textAlign: "center" }}>Language</label>
                <DropdownComponent
                    options={languageDropdownConst} />
            </div>
            <div className="ul-dashboard-drop-down">
                <label style={{ textAlign: "center" }}>Sexuality</label>
                <DropdownComponent
                    options={SexualityDropdownConst} />
            </div>
            <div className="ul-dashboard-drop-down">
                <label style={{ textAlign: "center" }}>Date</label>
                <div style={{ display: "flex" }}>
                    <div>
                        <DatePicker
                            placeholderText="Start Date"
                            className="form-control"
                            selected={filter?.date?.startDate}
                            onChange={(data) => onChangeDateValue(data, "startDate")}
                        />
                    </div>
                    <div>
                        <DatePicker
                            placeholderText="End Date"
                            className="form-control"
                            startDate={filter?.date?.startDate}
                            selected={filter?.date?.endDate}
                            onChange={(data) => onChangeDateValue(data, "endDate")}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilterUsers