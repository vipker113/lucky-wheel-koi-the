import { useState } from "react";
import { RotateCw, X } from "lucide-react";

const AutoSpinCheckbox = ({ onChange = () => {} }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);

    if (typeof onChange === "function") {
      onChange(newChecked);
    }
  };

  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="hidden-checkbox"
      />
      <div className={`custom-checkbox ${isChecked ? "spinning" : ""}`}>
        {isChecked ? <RotateCw /> : <X />}
      </div>
      <span className="label-text">Tự động quay</span>
    </label>
  );
};

export default AutoSpinCheckbox;
