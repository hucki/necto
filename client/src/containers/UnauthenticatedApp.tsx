import React from 'react';
import { Layout } from 'antd';
import LoginButton from '../components/Auth/LoginButton';
import { Route, Switch } from 'react-router';
import VerifySignup from '../components/Auth/VerifySignup';


function UnauthenticatedApp(): JSX.Element {

  return (
    <>
      <Layout className="site-layout">
        <Switch>
          <Route exact path="/">
            <h1>Welcome</h1>
            <div>Please login</div>
          <LoginButton />
          </Route>
          <Route path="/verify">
            <VerifySignup />
          </Route>
        </Switch>
      </Layout>
    </>
  );
}

export default UnauthenticatedApp;
