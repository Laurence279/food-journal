import {Button, Modal} from 'react-bootstrap'
import {useState} from 'react'

function InputUser({show, handleClose, submitUser}) {

    const [name, setName] = useState("")

    function handleChange(e){
      
      if(e.target.value.length < 12){
        setName(e.target.value)
      }

    }
  
    return (
      <>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Welcome! What's your name?</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex align-items-center justify-content-center">
            <label className="px-2 lead"  htmlFor="username-input">Name: </label> 
            <input maxLength={12} required onChange={handleChange} className="p-1"  type="text" id="username-input" name="username" ></input>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>{
              setName("")
              handleClose();
            }}>
              Close
            </Button>
            <Button variant="primary" onClick={()=>{
              if(name.length > 0){
                submitUser(name)
                setName("")
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