import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import MyRouter from './Components/MyRouter';

function App() {

  return (
    <div className="App" dir='rtl'>

      <BrowserRouter>
        <MyRouter />
      </BrowserRouter>

    </div>
  );
}

export default App;
