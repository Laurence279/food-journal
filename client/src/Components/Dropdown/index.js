



function Dropdown({handleChange, users}){

    
    return (
        <select id="dropdown" onChange={handleChange} selected defaultValue="Select User">
        <option    defaultValue="" disabled hidden>Select User</option>
        {users.map((user)=>{
              return <option className="dropdown-option" key={user} value={user}>{user}</option>
            })}
            <option value="new">New User...</option>
          </select>
    )
}

export default Dropdown