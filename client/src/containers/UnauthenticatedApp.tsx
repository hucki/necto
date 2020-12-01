import React from 'react';
import { Layout } from 'antd';
import LoginButton from '../components/Auth/LoginButton';
import { Route, Switch } from 'react-router';
import VerifySignup from '../components/Auth/VerifySignup';
import { useAuth0 } from '@auth0/auth0-react';
import Header from '../components/Header/Header';
import { FullPageSpinner } from '../components/Library';


function UnauthenticatedApp(): JSX.Element {
  const { isLoading } = useAuth0();
  return (
    <div>
      <Layout className="site-layout">
        <Header userName="Guest" />
        {isLoading
          ? <FullPageSpinner />
          : <Switch>
              <Route path="/verify">
                <VerifySignup />
              </Route>
              <Route path="*">
                <h1>Welcome</h1>
                <div>Please login</div>
                <LoginButton />
              </Route>
            </Switch>
        }
      </Layout>
    </div>
  );
}

export default UnauthenticatedApp;
