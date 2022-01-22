import {Button, Modal} from 'react-bootstrap'
import {useState} from 'react'

function InputUser({show, handleClose, submit, username}) {

    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    function handleChange(e){
      
      if(e.target.value.length < 12){
        setPassword(e.target.value)
      }

    }
  
    return (
      <>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{username}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
            <label className="px-2 lead"  htmlFor="username-input">Password: </label> 
            <input maxLength={12} required onChange={handleChange} className="p-1"  type="password" id="username-input" name="username" ></input>
            <p style={{color: "red", height: "20px", padding:".5em"}}>{error}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>{
              setPassword("")
              handleClose();
              setError("")
            }}>
              Close
            </Button>
            <Button variant="primary" onClick={async ()=>{
              setError("")
              if(password.length > 0){
              try{
                await submit(username, password)
              }
              catch(err){
                setError(err.message)
                return
              }
                setPassword("")
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