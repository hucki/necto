import React from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import {useAuth0} from '@auth0/auth0-react'
import LogoutButton from "./LogoutButton";

const VerifySignup = ():JSX.Element => {
  const { isAuthenticated } = useAuth0();
  const search = useLocation().search;
  const auth0State = new URLSearchParams(search).get('state');
  console.log(auth0State)

  if(isAuthenticated) return <Redirect to="/" />

  return (
    <>
      <div>Please verify your email address!</div>
      <LogoutButton />
      <Link to="/">back to start</Link>
    </>
  );
};

export default VerifySignup;