import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import reducer from '../reducers/index';
import { Provider } from 'react-redux';
// import { ReactQueryDevtools } from 'react-query-devtools';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';
import { useAuth0 } from '@auth0/auth0-react';
import { FullPageSpinner } from '../components/Library';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { UserDateProvider } from '../providers/UserDate';
import { FilterProvider } from '../providers/filter/FilterContextProvider';

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
  const { user, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) return <FullPageSpinner />;
  return (
    <Provider store={store}>
      <UserDateProvider>
        <FilterProvider>
          <ChakraProvider>
            <Container m={0} p={0}>
              <Router>
                {isAuthenticated && user?.sub ? (
                  <AuthenticatedApp a0Id={user?.sub} />
                ) : (
                  <UnauthenticatedApp />
                )}
              </Router>
            </Container>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </ChakraProvider>
        </FilterProvider>
      </UserDateProvider>
    </Provider>
  );
}

export default App;
