import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import { Thing } from '../.';

const App = () => {
  return (
    <div>
      Hello TSDx
      {/* <Thing /> */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
