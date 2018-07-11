import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './containers/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {store} from "./Redux/store";
import {Provider} from "react-redux";

ReactDOM.render(
    <Provider store={store as any}>
        <App />
    </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
