import React from "react";
//import Navbar from "./components/Navbar"; //////
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";



function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/"
          element={token ? <HomePage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
