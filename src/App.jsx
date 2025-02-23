import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from "./Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/WattZAP-Chat' element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
