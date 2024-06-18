import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

function SearchComponent({ data, onChange, onClickCloseIcon, placeholder }) {
    return (
        <>
            <div className="input-with-icon-label">
                <input
                    type="text"
                    className="form-control"
                    id="search"
                    placeholder={placeholder || "Search..."}
                    name="search"
                    onChange={onChange}
                    value={data}
                    style={{ paddingLeft: '30px', paddingRight: '30px' }}
                />
                <FaSearch className="input-with-icon-design-right" color="grey" />
                {data?.length > 0 && <RxCross2 className="input-with-icon-design" color="grey" onClick={onClickCloseIcon} />}
            </div>
        </>
    )
}

export default SearchComponent