import React from "react";
import Select from "react-select";

function CustomDropDown({
  prizes,
  selectedPrize,
  setSelectedPrize,
  onPrizeSelect,
  isLoading,
  isSpinning,
}) {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: "240px",
      fontWeight: "900",
      maxWidth: "600px",
      border: "3px solid #f5e4bd",
      height: "60px",
      textAlign: "center",
      backgroundColor: "#3b5b5a",
      textTransform: "uppercase",
      color: "#f5e4bd",
      borderRadius: "8px",
      fontSize: "24px",
      cursor: "pointer",
      outline: "none",
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: "600px",
      whiteSpace: "normal",
      wordWrap: "break-word",
      backgroundColor: "#3b5b5a",
      zIndex: 10,
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {
        background: "#3b5b5a",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#f5e4bd",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: "#f5e4bd",
      },
    }),
    menuList: (provided) => ({
      ...provided,
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {
        background: "#3b5b5a",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#f5e4bd",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: "#f5e4bd",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "24px",
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
      cursor: "pointer",
      color: state.isSelected ? "#3b5b5a" : "#f5e4bd",
      backgroundColor: state.isSelected ? "#f5e4bd" : "#3b5b5a",
      ":hover": {
        backgroundColor: "#f5e4bd",
        color: "#3b5b5a",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f5e4bd",
    }),
  };

  return (
    <div className="controls">
      <div className="custom-dropdown">
        <Select
          value={selectedPrize}
          onChange={(selected) => {
            setSelectedPrize(selected);
            onPrizeSelect(selected);
          }}
          options={prizes}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          styles={customStyles}
          menuPlacement="auto"
          loadingMessage={() => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="loading-spinner"></div>
            </div>
          )}
          placeholder={isLoading ? "Loading..." : "Chọn giải thưởng"}
          isLoading={isLoading}
          isDisabled={isLoading || isSpinning}
        />
      </div>
    </div>
  );
}

export default CustomDropDown;
