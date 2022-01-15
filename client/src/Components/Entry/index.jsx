import React from "react";

function Entry(props) {
  const entry = props.foodDescription;

  const foodTypes = props.foodTypes.join(", ");

  function deleteEntry() {
    const entry = {
      index: props.index,
      timeOfDay: props.timeOfDay.toLowerCase(),
    }
    props.whenDeleted(entry);
  }

  return (
    <div className="entry-container">
      <p className="entry-text">
        <strong>{foodTypes}</strong>
      </p>
      <p className="entry-text">{entry}</p>
      <button onClick={deleteEntry} className="delete-btn">
        X
      </button>
    </div>
  );
}

export default Entry;
