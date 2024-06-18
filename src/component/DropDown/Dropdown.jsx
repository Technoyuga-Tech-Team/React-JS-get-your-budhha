import Select from "react-select";

const DropdownComponent = ({
  options,
  onChange,
  defaultVal,
  value,
  width,
  padding,
  placeholder,
  isDisabled
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: width || "100%",
      borderRadius: 4,
      borderColor: state.isFocused ? "rgba(31, 31, 31, 1)" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.1rem rgba(31, 31, 31, 0.1)" : null,
      backgroundColor: state.isDisabled ? '#eff2f7' : 'white',
      color: "#505d69"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "rgba(31, 31, 31, 1)" : "white",
      color: state.isSelected ? "white" : "black",
      padding: padding || "8px",
      paddingLeft: 8,
      "&:hover": {
        backgroundColor: "#c7c5c5",
        color: "black",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#c7c5c5",
      borderRadius: 2,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#c7c5c5",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? '#505d69' : ' #505d69' // Change text color for selected value
    }),
  };

  return (
    <div>
      <Select
        options={options}
        styles={customStyles}
        onChange={onChange}
        placeholder={placeholder || "Select an option"}
        defaultValue={defaultVal}
        isSearchable={false}
        value={value}
        isDisabled={isDisabled || false}
      />
    </div>
  );
};

export default DropdownComponent;
