
import { useState } from 'react';
import './App.css';
import LiveChat from './components/LiveChat/LiveChat';

function App({teamCdn}) {
  return (
    <div className="App">
      <LiveChat teamCdn={teamCdn}/>
    </div>
  );
}

export default App;
