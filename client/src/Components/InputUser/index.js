import {Button, Modal} from 'react-bootstrap'
import {useState} from 'react'

function InputUser({show, handleClose, submitUser}) {

    const [name, setName] = useState("")
    const [pass, setPass] = useState("")
    const [error, setError] = useState("")

    function handleChange(e){
      
      if(e.target.value.length < 12){
        setName(e.target.value)
      }

    }
    function handleChangePass(e){
      
      if(e.target.value.length < 12){
        setPass(e.target.value)
      }

    }
  
    return (
      <>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Welcome! Please create a username..</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex align-items-center flex-column">
            <label className="px-2 lead"  htmlFor="username-input">Name: </label> 
            <input maxLength={12} required onChange={handleChange} className="p-1"  type="text" id="username-input" name="username" ></input>
            <label className="px-2 lead"  htmlFor="password-input">Set a Password: </label> 
            <input maxLength={12} required onChange={handleChangePass} className="p-1"  type="password" id="password-input" name="password" ></input>
            <p style={{color: "red", height: "20px", padding:".5em"}}>{error}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>{
              setName("")
              setPass("")
              handleClose();
              setError("")
            }}>
              Close
            </Button>
            <Button variant="primary" onClick={async ()=>{
              setError("")
              if(name.length > 0){
              try{
                await submitUser(name, pass)
              }
              catch(err){
                setError(err.message)
                return
              }
                setName("")
                setPass("")
              }
              }}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  export default InputUser;