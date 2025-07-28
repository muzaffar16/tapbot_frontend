// Home.jsx
import React, { useState } from 'react';
import Mainpg from './mainpg';
import '../styles/popup.css';   // same CSS file for launcher + popup

const Home = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* your normal homepage content */}
      <h1>Home Page</h1>
        
      {/* Floating chat-bubble button */}
      {!open && (
        <button className="chat-launcher" onClick={() => setOpen(true)}>
          <i className="bi bi-chat-dots"></i>
        </button>
      )}

      {/* Render mainpg as popup */}
      {open && <Mainpg isPopup onClose={() => setOpen(false)} />}
    </>
  );
};

export default Home;
