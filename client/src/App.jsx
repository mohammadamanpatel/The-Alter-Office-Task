import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import OAuthRedirect from "./components/OAuthRedirect";
import Home  from "./components/Home";

const App = () => {
  const token = localStorage.getItem("token");
  // console.log("token", token);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          {/* If token exists, show Home and Dashboard */}
          {token ? (
            <>
              <Route path="/" element={<Home />} />
            </>
          ) : (
            // If no token, show Login page
            <>
              <Route path="/Login" element={<Login />} />
              <Route path="/dashboard" element={<OAuthRedirect />} />
            </>
          )}

          {/* Optional: You can also add a catch-all route for undefined paths */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
