import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import reducer from '../reducers/index';
import { Provider } from 'react-redux';
import { Layout } from 'antd';
import { ReactQueryDevtools } from 'react-query-devtools';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';
import { useAuth0 } from '@auth0/auth0-react';
import { FullPageSpinner } from '../components/Library';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {
  /*console.log('NEW STATE', store.getState())*/
});
function App() {
  const {isAuthenticated, isLoading } = useAuth0();
  if(isLoading) return <FullPageSpinner />
  return (
    <Provider store={store}>
      <Layout style={{ minHeight: '100vh' }}>
        <Router>
          {isAuthenticated ? <AuthenticatedApp />: <UnauthenticatedApp /> }
        </Router>
      </Layout>
      <ReactQueryDevtools initialIsOpen="false" />
    </Provider>
  );
}

export default App;
