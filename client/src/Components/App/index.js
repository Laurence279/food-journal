import React, { useEffect, useState, useCallback, useReducer } from "react";
import Input from "../Input";
import Day from "../Day";
import TimeOfDay from "../TimeOfDay";
import './App.css';


const data = {
  user: "Laur",
  days: [
    {
      date: "Sun Jan 16 2022",
      morning: [
        {
          id: (Math.random().toString(36).substring(2, 18)),
          foodDescription: "Apple",
          foodTypes: ["Fruit"]
        },
        {
          id: (Math.random().toString(36).substring(2, 18)),
          foodDescription: "Chocolate Bar",
          foodTypes: ["Chocolate"]
        },
        {
          id: (Math.random().toString(36).substring(2, 18)),
          foodDescription: "Yoghurt",
          foodTypes: ["Dairy"]
        }
      ],
      afternoon: [
        {
          id: (Math.random().toString(36).substring(2, 18)),
          foodDescription: "Crisps",
          foodTypes: ["Bread"]
        }
      ],
      evening: []
    },
    {
      date: "Mon Jan 17 2022",
      morning: [
        {
          id: (Math.random().toString(36).substring(2, 18)),
          foodDescription: "Apple",
          foodTypes: ["Fruit"]
        }

      ],
      afternoon: [
        {
          id: (Math.random().toString(36).substring(2, 18)),
          foodDescription: "Crisps",
          foodTypes: ["Bread"]
        }
      ],
      evening: [
        {
          id: (Math.random().toString(36).substring(2, 18)),
          foodDescription: "Chocolate Bar",
          foodTypes: ["Chocolate"]
        }
      ]
    }
  ]
}

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const types = {
  USERNAME: 'USERNAME',
  DATE: 'DATE',
  ENTRIES_TODAY: 'ENTRIES_TODAY',
  ADD_ENTRY: 'ADD_ENTRY',
  DELETE_ENTRY: 'DELETE_ENTRY',
  UPDATE_TOTAL_ENTRIES: 'UPDATE_TOTAL_ENTRIES',
  UPDATE_ENTRY_IN_TOTAL_ENTRIES: 'UPDATE_ENTRY_IN_TOTAL_ENTRIES'
}

const reducer = (state, action) => {
  switch (action.type) {
    case types.USERNAME: // Set the username
      return { ...state, username: action.value }
    case types.DATE:  // Set the current day/date that this entry contains
      return { ...state, date: action.value }
    case types.ENTRIES_TODAY: 

    console.log("Looking for entries for " + state.date)
    const todaysEntry = findDateInEntries(state.entriesTotal, state.date)
    if(!todaysEntry) return state
    console.log("Fetched entries...", todaysEntry)
    return {...state, entriesToday: todaysEntry}

    case types.ADD_ENTRY: // Add an entry to today's log
      const timeOfDayToAddItem = action.value.timeOfDay
      const itemToAdd = {
        id: action.value.id,
        foodDescription: action.value.foodDescription,
        foodTypes: action.value.foodTypes
      }
      return { ...state, entriesToday: {...state.entriesToday, [timeOfDayToAddItem]: [...state.entriesToday[timeOfDayToAddItem], itemToAdd]}} 
    case types.DELETE_ENTRY: // Remove an entry from today's log
      const timeOfDayToRemoveItem = action.value.timeOfDay
      const indexToRemoveDelEntry = action.value.index
      const arrayToRemoveFrom = [...state.entriesToday[timeOfDayToRemoveItem]]
      return { ...state, entriesToday: {...state.entriesToday, [timeOfDayToRemoveItem]: [...arrayToRemoveFrom
        .slice(0, indexToRemoveDelEntry),...arrayToRemoveFrom.slice(indexToRemoveDelEntry + 1)]}}
    case types.UPDATE_TOTAL_ENTRIES: // Update all entries stored for this user..
  
    console.log("Updating Total Entries", action.value)
        return {...state, entriesTotal: action.value}

    case types.UPDATE_ENTRY_IN_TOTAL_ENTRIES: // Update one entry inside total entries stored for this user..

        if(action.value.morning.length === 0 && action.value.afternoon.length === 0 && action.value.evening.length === 0) return state
        const indexToRemoveUpdateTotal = findIndexInEntries(state.entriesTotal, action.value.date);
        if(indexToRemoveUpdateTotal === -1){
          return {...state, entriesTotal: [...state.entriesTotal, action.value]}
        }
        const updatedEntry = {
          date: action.value.date,
          morning: [...action.value.morning],
          afternoon: [...action.value.afternoon],
          evening: [...action.value.evening]
        }
        return {...state, entriesTotal: [...state.entriesTotal.slice(0, indexToRemoveUpdateTotal), updatedEntry, ...state.entriesTotal.slice(indexToRemoveUpdateTotal + 1)]}
    default:
      return state;
  }
}

const initialState = {
  username: "Laur",
  date: today.toDateString(),
  entriesToday: {
    date: today.toDateString(),
    morning: [],
    afternoon: [],
    evening: []
  },
  entriesTotal: []
}


function findDateInEntries(entries,date){

  //Returns an object containing the entries for the specified date found in the user's document.
  //Returns empty entry object if not found

  const emptyEntry = {
    date: date,
    morning: [],
    afternoon: [],
    evening: []
  }

  if(!entries) return

  const foundMatchIndex = entries.findIndex((entry)=>{
    return entry.date === date
  })
  if(foundMatchIndex === -1) return emptyEntry
  return entries[foundMatchIndex]

}

function findIndexInEntries(entries, date){

  //Returns the index in total entries that contains this date
  if(!entries) return

  return entries.findIndex((entry)=>{
    return entry.date === date
  })



}


function App() {



  //State Management
  const [state, dispatch] = useReducer(reducer, initialState)

  //Does selected date have any entries?
  const [isEmpty, setEmpty] = useState(true)
  
  
  
  const checkIfEntriesEmpty = useCallback(()=>{
    console.log("running check if empty")
    if (
      state.entriesToday.morning.length === 0 &&
      state.entriesToday.afternoon.length === 0 &&
      state.entriesToday.evening.length === 0
    ) 
    {
        return "No Entries";
    } else {
        return "";
    }

  }, [state.entriesToday]) 






  //Run on load

  useEffect(()=>{
    console.log("Fetching data...")
    async function fetchData(){
        dispatch({type: types.UPDATE_TOTAL_ENTRIES, value: data.days})
    }
    fetchData()

  },[])

    // Run when date is changed

    useEffect(()=>{
      console.log("Date changed to " + state.date)
      dispatch({type:types.ENTRIES_TODAY});
    },[state.date])
    
  
  //Run when today's entries change

  useEffect(()=>{
    console.log("Today's entries changed")
    dispatch({type: types.UPDATE_ENTRY_IN_TOTAL_ENTRIES, value: state.entriesToday})
    setEmpty(checkIfEntriesEmpty());
  },[state.entriesToday, checkIfEntriesEmpty])

  // Managing today's entry

  function addEntry(item){
    
    if (item.foodDescription === "" && item.foodTypes.length === 0) {
      return;
    }
    const foodObject = {
      timeOfDay: item.timeOfDay,
      id: (Math.random().toString(36).substring(2, 18)),
      foodDescription: item.foodDescription === "" ? `Generic ${item.foodTypes.join(", ")}` : item.foodDescription,
      foodTypes: item.foodTypes.length === 0 ? ["Other"] : item.foodTypes
    };
    dispatch({type: types.ADD_ENTRY, value: foodObject})
  }

  function deleteEntry(item){
    dispatch({type: types.DELETE_ENTRY, value: item})
  }

  // Managing other entries



  function onPrev(){
    const previousDayFromToday = new Date(state.date);
    previousDayFromToday.setDate(previousDayFromToday.getDate() - 1);
    dispatch({type: types.DATE, value: previousDayFromToday.toDateString()})

  }

  function onNext(){
    const nextDayFromToday = new Date(state.date);
    nextDayFromToday.setDate(nextDayFromToday.getDate() + 1);
    if(nextDayFromToday >= today){
      return today
    }
    dispatch({type: types.DATE, value: nextDayFromToday.toDateString()})
  }




    return (
    
        <div>
        <header>
            <h1>Dietary Journal</h1>
            <h3>{state.username}</h3>
            <Day date={state.date} onPrev={onPrev} onNext={onNext} />

        </header>
        <h2 className="is-empty">{isEmpty}</h2>
        <TimeOfDay whenDeleted={deleteEntry} entryList={state.entriesToday.morning} time="Morning"/>
        <TimeOfDay whenDeleted={deleteEntry} entryList={state.entriesToday.afternoon} time="Afternoon"/>
        <TimeOfDay whenDeleted={deleteEntry} entryList={state.entriesToday.evening} time="Evening"/>

        <Input whenSubmit={addEntry}/>

        </div>
    
      )}

  export default App;