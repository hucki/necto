import React from 'react';
import { Layout } from 'antd';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';
import { createStore } from 'redux';
import reducer from '../reducers/index';
import { Provider } from 'react-redux';
import AppMenu from '../components/AppMenu/AppMenu';
import { ReactQueryDevtools } from 'react-query-devtools';

const { Content: AntContent } = Layout;

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {
  /*console.log('NEW STATE', store.getState())*/
});
function App() {
  return (
    <Provider store={store}>
      <Layout style={{ minHeight: '100vh' }}>
        <AppMenu />
        <Layout className="site-layout">
          <Header />
          <AntContent style={{ margin: '0 16px' }}>
            <Dashboard style={{ height: '100%' }} />
          </AntContent>
          <Footer />
        </Layout>
      </Layout>
      <ReactQueryDevtools initialIsOpen />
    </Provider>
  );
}

export default App;
