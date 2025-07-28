import React, { useState } from 'react';
import Header from './Header';
import '../styles/bot.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/popup.css';
import boticon from '../assets/boticon.png'
import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

//button category
const categories = [
  { label: 'Pricing', msg: 'Suggest all possible questions/categories about Pricing and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting' },
  { label: 'Sales & Offers', msg: 'show all possible product which you offer and when user select it than share information regarding this to user, and tell user enter 1 for this ,2 for that and so on, and start with greeting' },
  { label: 'Availability', msg: 'Suggest all possible questions/categories about availability and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting' },
  { label: 'Redemption Help', msg: 'Suggest all possible questions/categories about Redemption Help and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting' },
  { label: 'Payment Methods', msg: 'Which payment methods are accepted?' },
  { label: 'Complain', msg: ' ask what issue they are facing in a kind, helpful tone, Suggest all possible questions/categories about Complain or issue and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting' },
  { label: 'Ask Help', msg: 'Print only a welcome msg to user' }
];

//main body
const Bot = ({ isPopup = false, onClose, web_data }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Date.now().toString());
  const [allowInput, setAllowInput] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  // const [showCat, setShowCat] = useState(true);
  const [closeBtnShow, setcloseBtnShow] = useState(true)

  useEffect(() => {
    if (web_data) {
      document.documentElement.style.setProperty('--bot-bg', web_data.bg_color_code || '#37c673');
      document.documentElement.style.setProperty('--bot-body', web_data.body_color_code || '#0D0D0D');
      document.documentElement.style.setProperty('--bot-accent', web_data.accent_color || '#1F1F1Ff');
    }
  }, [web_data]);

  //clean bot message
 const cleanMessage = (text) => text
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/\\n/g, '<br />')
  .trim();

  //when user enter 0 - goto main menu
  const handleMainMenuClick = () => {
    setMessages((prev) => [...prev, { sender: 'bot', text: '🔁 Returned to Main Menu' }]);
    setTimeout(() => {
      setMessages([]);
      setQuery('');
      setAllowInput(false);
      setShowButtons(true);
    }, 1500);
  };

  //user click send button send msg to bot
  const handleSend = async (text = query, showUserMsg = true) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    //if msg ==0 goto main pg
    if (trimmed === '0') return handleMainMenuClick();

    //display msg to chat screen
    if (showUserMsg) {
      setMessages((prev) => [...prev, { sender: 'user', text: trimmed }]);
    }

    setQuery(''); // set input field empty
    setLoading(true);
    setShowButtons(false);

    //send msg to gemeini 
    try {
      const res = await fetch(`/chat-relay?websiteName=${web_data.websiteName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId }),
      });

      //get gemini responce and display to screen
      const data = await res.json();
      const botMessage = `${data.reply}<br /><br /><em>Enter <strong>0</strong> for 🔁 Go to Main Menu</em>`;
      setMessages((prev) => [...prev, { sender: 'bot', text: botMessage }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: '⚠️ Error talking to server.' }]);
    } finally {
      setLoading(false);
    }
  };

  //when user click any category btn from main menu
  const handleCategoryClick = (msg) => {
    handleSend(msg, false);
    setAllowInput(true);
    setShowButtons(false);
  };
  const renderMessages = () =>
    messages.map((m, i) => (

      <div key={i} className={m.sender === 'user' ? 'user-msg' : 'bot-msg'}>
        {m.sender === 'bot' && (
          <div className="botIcon">
            <img src={boticon} alt="Bot" />
          </div>
        )}
        <div
          className="message-text"
          dangerouslySetInnerHTML={{
            __html: m.sender === 'user' ? m.text : cleanMessage(m.text),
          }}
        />
      </div>
    ));

  //render category buttons eg. pricing etc
  const renderButtons = () =>
    showButtons && (
      <>
        <div className="msg">
          <span>How may I assist you today?</span>
        </div>
        <div className="category-buttons">
          {categories.map(({ label, msg }) => (
            <button key={label} onClick={() => handleCategoryClick(msg)}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>
      </>
    );

  const goBackToCategories = () => {
    setMessages([]);         // Clear messages
    setQuery('');
    setAllowInput(false);    // Disable input box
    setShowButtons(true);    // Show category buttons again
  };

  //main content that display to user
  const content = (
    <div className="msg-window">
      <Header
        web_data={web_data}
        closeBtnShow={closeBtnShow}
        onClose={onClose}
        showCat={!showButtons}
        onBackClick={goBackToCategories}
      />
      {!showButtons && (
        <div className="header">
          <div className="header-time">{new Date().toLocaleString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      )}
      <div className="chat-window">
          {loading ? (
            <p className="typing-indicator">tapBot is typing…</p>
          ) : showButtons ? (
            renderButtons()
          ) : (
            renderMessages()
          )}
      </div>

      {/* input field */}
      {allowInput && (
        <div className="input-border">

          <div className="user-input">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type Your Message"
              className="input-box"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />

            <button className="send-btn" onClick={() => handleSend()} >
              <i className="bi bi-send-fill"></i>
            </button>

          </div>
        </div>
      )}
    </div>
  );

  //if not popup then show content else show neche wala div
  return !isPopup ? content : (
    <div className="popup-box animated-popup">
      {/* <div className="popup-header">
        <span>Ask Questions</span>
        <button className="popup-close" onClick={onClose} >
          &times;
        </button>
      </div> */}
      {content}
    </div>
  );
};

export default Bot;
