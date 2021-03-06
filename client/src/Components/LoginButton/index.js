import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Button} from 'react-bootstrap';

function LoginButton({hidden, size, text}) {
  const { loginWithRedirect } = useAuth0();
  return <Button size={size} variant="dark" hidden={!hidden} onClick={() => loginWithRedirect()}>{text}</Button>;
};

export default LoginButton;