import { useState } from "react"
import { CookiesProvider } from "react-cookie"
import "./App.css"
import LiveChat from "./components/LiveChat/LiveChat"
import { PeerProvider } from "./context/PeerContext"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function App({ teamCdn }) {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <PeerProvider>
            <LiveChat teamCdn={teamCdn} />
          </PeerProvider>
        </CookiesProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
