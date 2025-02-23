import React from "react";
import Select from "react-select";

export default function Controls({
  selectedRound,
  setSelectedRound,
  rounds,
  currentPrizeIndex,
  setCurrentPrizeIndex,
  prizes,
  convertPrize,
}) {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: "fit-content",
      width: "440px",
      fontWeight: "900",
      border: "4px solid #f5e4bd",
      height: "60px",
      textAlign: "center",
      backgroundColor: "#8e291d",
      textTransform: "uppercase",
      color: "#f5e4bd",
      borderRadius: "8px",
      fontSize: "28px",
      cursor: "pointer",
      outline: "none",
    }),
    menu: (provided) => ({
      ...provided,
      whiteSpace: "normal",
      wordWrap: "break-word",
      width: "440px",
      backgroundColor: "#8e291d",
      zIndex: 10,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "24px",
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
      cursor: "pointer",
      color: state.isSelected ? "#8e291d" : "#f5e4bd",
      backgroundColor: state.isSelected ? "#f5e4bd" : "#8e291d",
      ":hover": {
        backgroundColor: "#f5e4bd",
        color: "#8e291d",
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
          value={rounds.find((r) => r.id === selectedRound)}
          onChange={(selected) => setSelectedRound(selected.id)}
          options={rounds}
          getOptionLabel={(round) => `Giải ${convertPrize(round.name)}`}
          getOptionValue={(round) => round.id}
          styles={customStyles}
          menuPlacement="auto"
        />
      </div>

      <div className="custom-dropdown">
        <Select
          value={prizes[currentPrizeIndex]}
          onChange={(selected) =>
            setCurrentPrizeIndex(prizes.findIndex((p) => p.id === selected.id))
          }
          options={prizes}
          getOptionLabel={(prize) => prize.name}
          getOptionValue={(prize) => prize.id}
          styles={customStyles}
          menuPlacement="auto"
        />
      </div>
    </div>
  );
}
