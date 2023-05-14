import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './containers/App';
import './i18n/config';
import * as serviceWorker from './serviceWorker';
import { ColorModeScript } from '@chakra-ui/react';
import theme from './styles/theme';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
