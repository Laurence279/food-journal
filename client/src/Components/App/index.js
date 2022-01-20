import React, { useEffect, useState, useCallback, useReducer } from "react";
import InputUser from "../InputUser";
import Input from "../Input";
import Day from "../Day";
import TimeOfDay from "../TimeOfDay";
import Dropdown from "../Dropdown"
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const types = {
  USERS: 'USERS',
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
    case types.USERS: // Set all users found in db..
      return { ...state, users: action.value}
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
      if(state.username === "") return state
      const timeOfDayToAddItem = action.value.timeOfDay
      const itemToAdd = {
        id: action.value.id,
        foodDescription: action.value.foodDescription,
        foodTypes: action.value.foodTypes
      }
      updateEntry(state.username, {...state.entriesToday, [timeOfDayToAddItem]: [...state.entriesToday[timeOfDayToAddItem], itemToAdd]} )
      return { ...state, entriesToday: {...state.entriesToday, [timeOfDayToAddItem]: [...state.entriesToday[timeOfDayToAddItem], itemToAdd]}} 
    case types.DELETE_ENTRY: // Remove an entry from today's log
    if(state.username === "") return state
      const timeOfDayToRemoveItem = action.value.timeOfDay
      const indexToRemoveDelEntry = action.value.index
      const arrayToRemoveFrom = [...state.entriesToday[timeOfDayToRemoveItem]]
      updateEntry(state.username, {...state.entriesToday, [timeOfDayToRemoveItem]: [...arrayToRemoveFrom
        .slice(0, indexToRemoveDelEntry),...arrayToRemoveFrom.slice(indexToRemoveDelEntry + 1)]} )
      return { ...state, entriesToday: {...state.entriesToday, [timeOfDayToRemoveItem]: [...arrayToRemoveFrom
        .slice(0, indexToRemoveDelEntry),...arrayToRemoveFrom.slice(indexToRemoveDelEntry + 1)]}}
    case types.UPDATE_TOTAL_ENTRIES: // Update all entries stored for this user..
  
    console.log("Updating Total Entries", action.value)
        return {...state, entriesTotal: action.value}

    case types.UPDATE_ENTRY_IN_TOTAL_ENTRIES: // Update one entry inside total entries stored for this user..

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
  users: [],
  username: "",
  date: today.toDateString(),
  entriesToday: {
    date: today.toDateString(),
    morning: [],
    afternoon: [],
    evening: []
  },
  entriesTotal: []
}


async function updateEntry(user, entry){
  const response = await fetch(`/api/${user}`, {
    method: `POST`,
    mode: 'cors',
    body: JSON.stringify(entry),
    headers: {
        'content-type': 'application/json'
    }
});
console.log(response)
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






  //Run when username is changed

  useEffect(()=>{
    async function fetchData(){
      if(state.username === "") return
      // Fetch data from database for user that matches state.username
      // const response = await fetch...
      // const data = response.json()...
      // dispatch data.days...
      const response = await fetch(`/api/${state.username}`);
      const data = await response.json()
      console.log("data",data)
      dispatch({type:types.UPDATE_TOTAL_ENTRIES, value: data.days})
      dispatch({type:types.ENTRIES_TODAY});
    }
    fetchData()


  },[state.username])

  //Run on load

  useEffect(()=>{
    fetchUsers()
  },[])

  async function fetchUsers(){
    console.log("Fetching users...")
    const response = await fetch(`/api/users`);
    const data = await response.json()
    console.log("data",data)
    dispatch({type: types.USERS, value: data})
    }





    // Run when date is changed

    useEffect(()=>{
      console.log("Date changed to " + state.date)
      dispatch({type:types.ENTRIES_TODAY});
    },[state.date])
    
  
  //Run when today's entries change

  useEffect(()=>{
    console.log("Today's entries changed", state.entriesToday)
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
    console.log(item)
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

  function handleChange(event){
    if(event.target.value === "new"){
      handleShow()
      event.target.value = "Select User"
      return
    }
    if(event.target.value === "change"){
      event.target.value = "TEST";
      return
    }
    dispatch({type: types.USERNAME, value: event.target.value})
  }


  const [show, setShow] = useState(false);
  
  function handleClose(){
    setShow(false);

  } 
  function handleShow(){
    setShow(true);
  } 

  async function submitUser(name){
        //Post request to server
        console.log(`TODO: POST ${name} TO SERVER`)
        const response = await fetch(`/api/`, {
          method: `POST`,
          body: JSON.stringify({
              user: name
          }),
          headers: {
              'content-type': 'application/json'
          }
      });
      console.log(response)
      handleClose()
      await fetchUsers()
       dispatch({type: types.USERNAME, value: name})
      setDropdownValue(name);
  }

  function setDropdownValue(name){


      console.log("SETTING DROPDOWN")
     const options = document.querySelector("#dropdown").options;
    for(let i = 0; i < options.length; i++){
      console.log(options[i].value, name)
      if(options[i].value === name){

        options[i].selected = true
        console.log("found");
        return;
      }
  } 
    
}



    return (
    
        <div>
        <header>
        <Dropdown handleChange={handleChange} users={state.users}/>
            <h1>Dietary Journal</h1>
            <h3>{state.username}</h3>
            <Day date={state.date} onPrev={onPrev} onNext={onNext} />

        </header>
        <div id="content-wrap">
        <InputUser show={show} handleShow={handleShow} handleClose={handleClose} submitUser={submitUser}/>
        <h2 className="is-empty">{isEmpty}</h2>
        <TimeOfDay whenDeleted={deleteEntry} entryList={state.entriesToday.morning} time="Morning"/>
        <TimeOfDay whenDeleted={deleteEntry} entryList={state.entriesToday.afternoon} time="Afternoon"/>
        <TimeOfDay whenDeleted={deleteEntry} entryList={state.entriesToday.evening} time="Evening"/>

        <Input whenSubmit={addEntry}/>
        </div>
       

        </div>
    
      )}

  export default App;