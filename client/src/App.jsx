import React, { useEffect, useState } from 'react';
import Chat from './components/chat/Chat';
import Compiler from './components/compiler/Compiler';
import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(()=>{
    const theme=localStorage.getItem('theme');
    if(theme==='dark'){
      setDarkMode(true)
    }
  },[])
  useEffect(()=>{
    localStorage.setItem('theme',darkMode?'dark':'light')
  },[darkMode])
  
  return (
    <div className={`app-root ${darkMode ? 'dark' : 'light'}`}>
      <div className="top-bar-global">
        <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      <div className="main-container">
        <div className="chat-section">
          <Chat darkMode={darkMode} />
        </div>
        <div className="compiler-section">
          <Compiler darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default App;
