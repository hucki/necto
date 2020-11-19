import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import reducer from '../reducers/index';
import { Provider } from 'react-redux';
import { Layout } from 'antd';
import { ReactQueryDevtools } from 'react-query-devtools';
import AuthenticatedApp from './AuthenticatedApp';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {
  /*console.log('NEW STATE', store.getState())*/
});
function App() {
  const [isAuthenticated] = useState(true);

  if (!isAuthenticated) return (
    <div>not authenticated</div>
  )
  return (
    <Provider store={store}>
      <Layout style={{ minHeight: '100vh' }}>
        <Router>
          <AuthenticatedApp />
        </Router>
      </Layout>
      <ReactQueryDevtools initialIsOpen />
    </Provider>
  );
}

export default App;
