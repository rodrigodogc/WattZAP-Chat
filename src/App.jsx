import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from "./Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/wattzap-chat' element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
