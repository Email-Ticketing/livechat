import { useState } from "react";
import "./App.css";
import LiveChat from "./components/LiveChat/LiveChat";
import { PeerProvider } from "./context/PeerContext";

function App({ teamCdn }) {
  return (
    <div className="App">
      <PeerProvider>
        <LiveChat teamCdn={teamCdn} />
      </PeerProvider>
    </div>
  );
}

export default App;
