import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import reducer from '../reducers/index';
import { Provider } from 'react-redux';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { AuthProvider } from '../providers/AuthProvider';
import { AuthChecker } from './AuthChecker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const store = createStore(reducer);
store.subscribe(() => console.log('subscribed'));
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChakraProvider>
            <Container m={0} p={0}>
              <Router>
                <AuthChecker />
              </Router>
            </Container>
          </ChakraProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
