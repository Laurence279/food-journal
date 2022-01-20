import React, { useState } from "react";
import FoodType from "../FoodType";

function Input(props) {
  const [food, setFood] = useState("");
  const [time, setTime] = useState("morning");
  const [foodTypes, setFoodTypes] = useState([]);
  const [foodTypeVisible, setFoodTypeVisible] = useState("");

  function submit(event) {
    event.preventDefault();
    props.whenSubmit({
      timeOfDay: time,
      foodDescription: food,
      foodTypes: foodTypes
    });
    setFood("");
    setFoodTypes([]);
  }

  // document.addEventListener("click", function (e) {
  //   if (!e.target.closest("#form")) {
  //     hideFoodTypes();
  //   }
  // });

  function handleChangeFood(event) {
    const value = event.target.value;
    setFood(function () {
      return value;
    });
  }

  function handleChangeTime(event) {
    const value = event.target.value;
    setTime(function () {
      return value;
    });
  }

  function handleFocus(event) {

    setFoodTypeVisible(function () {
      return "";
    });
  }

  function hideFoodTypes() {
    setFoodTypeVisible(function () {
      return "hidden";
    });
  }

  function select(item) {
    if (foodTypes.includes(item)) {
      deselect(item);
      return null;
    }
    setFoodTypes(function (prev) {
      return [...prev, item];
    });
  }

  function deselect(item) {
    setFoodTypes(function (prev) {
      return [
        ...prev.filter(function (i) {
          return i !== item;
        })
      ];
    });
  }

  return (
    <div id="form-container">
      <form id="form">

        <select
          name="time-of-day"
          id="time"
          onChange={handleChangeTime}
          style={{
            fontSize: "1.125rem",
            padding: "0.25rem",
            marginBottom: "1rem"
          }}
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>


          <h3 style={{textAlign: "left"}}>What did you eat?</h3>

        <p className={`food-type-text ${foodTypeVisible}`}>
          Select all that apply.
        </p>
        <div className={`food-type-container ${foodTypeVisible}`}>
          <FoodType
            name="Fruit"
            icon="🍎"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          <FoodType
            name="Veg"
            icon="🥦"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          <FoodType
            name="Protein"
            icon="🍗"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          <FoodType
            name="Dairy"
            icon="🧀"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          <FoodType
            name="Carbs"
            icon="🍞"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          <FoodType
            name="Dessert"
            icon="🍨"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          <FoodType
            name="Takeaway"
            icon="🍔"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          <FoodType
            name="Soft Drink"
            icon="🥤"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          <FoodType
            name="Alcohol"
            icon="🍺"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />

          <FoodType
            name="Chocolate"
            icon="🍫"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          <FoodType
            name="Sweets"
            icon="🍬"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          <FoodType
            name="Bakery"
            icon="🍩"
            currentFoodTypes={foodTypes}
            onSelected={select}
          />
          
        </div>
        <input
          onFocus={handleFocus}
          onChange={handleChangeFood}
          value={food}
          style={{ fontSize: "1.5rem" }}
          placeholder="Enter a description.."
          maxLength="50"
        ></input>
        <button onClick={submit}>Add</button>

      </form>
    </div>
  );
}

export default Input;
