import React from "react";

function Day(props) {
  function prev(event) {
    event.preventDefault();
    props.onPrev();
  }

  function next(event) {
    event.preventDefault();
    props.onNext();
  }

  return (
    <div className="date-container" >
      <button className="date-btn" onClick={prev}>
        &#9756;
      </button>
      <p id="date">{props.date}</p>

      <button className="date-btn" onClick={next}>
        &#9758;
      </button>
    </div>
  );
}

export default Day;
