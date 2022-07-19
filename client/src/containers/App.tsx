import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import reducer from '../reducers/index';
import { Provider } from 'react-redux';
// import { ReactQueryDevtools } from 'react-query-devtools';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { AuthProvider } from '../providers/AuthProvider';
import { AuthChecker } from './AuthChecker';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

const store = createStore(
  reducer,
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {});
function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ChakraProvider>
          <Container m={0} p={0}>
            <Router>
              <AuthChecker />
            </Router>
          </Container>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
