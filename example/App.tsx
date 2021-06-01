import * as React from 'react';
import AppRoutes from './AppRoutes';
import AppSetup from './AppSetup';
import useAppSetup from './useAppSetup';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  const appSetup = useAppSetup();

  if (appSetup.hasAppSetup)
    return (
      <Router>
        <AppRoutes appSetup={appSetup} />
      </Router>
    );

  return <AppSetup appSetup={appSetup} />;
};

export default App;
