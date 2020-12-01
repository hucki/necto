import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const VerifySignup = ():JSX.Element => {

  return (
    <>
      <div>Please verify your email address!</div>
      <LogoutButton />
      <Link to="/">back to start</Link>
    </>
  );
};

export default VerifySignup;