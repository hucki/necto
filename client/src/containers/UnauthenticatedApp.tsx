import React from 'react';
import { Layout } from 'antd';
import LoginButton from '../components/Auth/LoginButton';


function UnauthenticatedApp(): JSX.Element {

  return (
    <>
      <Layout className="site-layout">
        <div>Please login</div>
        <LoginButton />
      </Layout>
    </>
  );
}

export default UnauthenticatedApp;
