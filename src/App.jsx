import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EtherealThreads from './components/EtherealThreads';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    // <Router>
    //   <div className="App">
    //     <EtherealThreads />
    //   </div>
    // </Router>
    <AppProvider>
      <EtherealThreads />
    </AppProvider>
  );
}

export default App;