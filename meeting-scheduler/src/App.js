import React from 'react';
import { AlertContextProvider } from "./services/alertContext";
import { AppDataProvider } from "./services/appDataContext";
import './App.css';

import AlertMessage from "./components/AlertMessage";
import Main from "./components/Main";

function App() {
  return (
    <div className="App">
      <div className="PageTitle">Meeting Scheduler</div>
      <AlertContextProvider>
        <AppDataProvider>
          <AlertMessage />
          <Main />
        </AppDataProvider>

      </AlertContextProvider>
    </div>
  );
}

export default App;
