import React from "react";
import Entry from "../Entry";

function TimeOfDay(props) {
  if (props.entryList.length === 0) {
    return null;
  }

  function deleteEntry(entry) {
    props.whenDeleted(entry);
  }

  return (
    <div className="ToD-container">
      <h3 className="ToD-title">{props.time}</h3>
      {props.entryList.map((item, index)=>{
        return (
          <Entry
            key={item.id}
            index={index}
            id={item.id}
            timeOfDay={props.time}
            foodDescription={item.foodDescription}
            foodTypes={item.foodTypes}
            whenDeleted={deleteEntry}
          />
        );
      })}
    </div>
  );
}

export default TimeOfDay;
