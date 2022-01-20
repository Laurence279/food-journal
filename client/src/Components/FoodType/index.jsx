import React, { useState, useEffect } from "react";

function FoodType(props) {
  const [selected, setSelected] = useState("");

  function handleClick(event) {
    props.onSelected(props.name);
  }

  const isSelected = props.currentFoodTypes.includes(props.name);

  useEffect(
    function () {
      setSelected(function () {
        if (isSelected) {
          return "selected";
        } else {
          return "";
        }
      });
    },
    [isSelected]
  );
  return (
    <div className={`box ${selected}`} onClick={handleClick}>
      <p style={{marginBottom: "0"}}>{props.name}</p>
      <span
        className="food-icon"
        role="img"
        aria-label={`${props.name.toLowerCase()}`}
      >
        {props.icon}
      </span>
    </div>
  );
}

export default FoodType;
