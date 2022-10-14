import { useState } from "react";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import LiveChat from "./components/LiveChat/LiveChat";
import { PeerProvider } from "./context/PeerContext";

function App({ teamCdn }) {
  return (
    <div className="App">
      <CookiesProvider>
        <PeerProvider>
          <LiveChat teamCdn={teamCdn} />
        </PeerProvider>
      </CookiesProvider>
    </div>
  );
}

export default App;
