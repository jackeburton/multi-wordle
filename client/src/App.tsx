import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import HomePage from "./homePage"
import GameWrapper from "./gameWrapper";

function App() {
  return (
    <Router>
    <div className="text-white">
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/game/:gameId" element={<GameWrapper />}/>
      </Routes>
    </div>
    </Router>
  )
}

export default App
