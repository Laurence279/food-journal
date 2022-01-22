import {Button, Modal} from 'react-bootstrap'
import {useState} from 'react'

function InputUser({show, handleClose, submit, username}) {

    const [password, setPassword] = useState("")

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
          <Modal.Body className="d-flex align-items-center justify-content-center">
            <label className="px-2 lead"  htmlFor="username-input">Password: </label> 
            <input maxLength={12} required onChange={handleChange} className="p-1"  type="text" id="username-input" name="username" ></input>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>{
              setPassword("")
              handleClose();
            }}>
              Close
            </Button>
            <Button variant="primary" onClick={()=>{
              if(password.length > 0){
                submit(username, password)
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