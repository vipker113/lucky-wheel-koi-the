import React from "react";
import Select from "react-select";

export default function Controls({
  selectedRound,
  setSelectedRound,
  rounds,
  currentPrizeIndex,
  setCurrentPrizeIndex,
  prizes,
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
      maxWidth: "600px",
      whiteSpace: "normal",
      wordWrap: "break-word",
      backgroundColor: "#3b5b5a",
      zIndex: 10,
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

  const roundNamme = rounds.find((r) => r.id === selectedRound);
  const currentPrize = prizes[currentPrizeIndex];

  return (
    <div className="controls">
      <div className="custom-dropdown" title={roundNamme && roundNamme.name}>
        <Select
          value={roundNamme}
          onChange={(selected) => setSelectedRound(selected.id)}
          options={rounds}
          getOptionLabel={(round) => `Giải ${round.name}`}
          getOptionValue={(round) => round.id}
          styles={customStyles}
          menuPlacement="auto"
        />
      </div>

      <div
        className="custom-dropdown"
        title={currentPrize && currentPrize.name}
      >
        <Select
          value={currentPrize}
          onChange={(selected) =>
            setCurrentPrizeIndex(prizes.findIndex((p) => p.id === selected.id))
          }
          options={prizes}
          getOptionLabel={(prize) => prize.name}
          getOptionValue={(prize) => prize.id}
          styles={{
            ...customStyles,
            menu: (provided) => ({
              ...provided,
              minWidth: "400px",
              maxWidth: "600px",
              whiteSpace: "normal",
              wordWrap: "break-word",
              backgroundColor: "#3b5b5a",
              zIndex: 10,
            }),
          }}
          menuPlacement="auto"
        />
      </div>
    </div>
  );
}
