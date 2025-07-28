import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Complain from './complain';
import Bot from './bot';
import '../styles/mainpg.css';
import '../styles/popup.css';

const API = import.meta.env.VITE_API_URL;

const Mainpg = ({ isPopup = true, onClose, initialConfig ,ssrData}) => {
  const [config, setConfig] = useState(initialConfig)
  const [website,setWebsite]=useState('')
  const [licenseKey,setlicenseKey]=useState('')
  const [showComplain, setShowComplain] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [validSite, setValidSite] = useState(null); // null = loading
  const [isInternet, setisInternet] = useState(true);

  //stop running api call two time
  const [isLoading, setIsLoading] = useState(false);

  const [web_data, setweb_data] = useState({
    websiteName: ssrData.webData.websiteName,
    bg_color_code: ssrData.webData.bg_color_code,
    color_code: ssrData.webData.body_color_code,
    font_color: ssrData.webData.accent_color,
    logo_url: ssrData.webData.logo_url,
    discription: ssrData.webData.discription
  });

  // const [web_data, setweb_data] = useState()
  

  useEffect(()=>{

          setValidSite(ssrData.isValid || false);
          document.documentElement.style.setProperty('--bot-bg', web_data.bg_color_code);
          document.documentElement.style.setProperty('--bot-body', web_data.color_code);
          document.documentElement.style.setProperty('--bot-accent', web_data.font_color);

  },[web_data]);



  const widget = (
    <div className="widget">
      <Header web_data={web_data} />
      <Footer web_data={web_data} isInternet={isInternet} />

      {isInternet && (
        <div className="chat-body">

          <div className="complain-btn">
            <button onClick={() => setShowComplain(true)}>
              <span>Add Complain</span>
            </button>
          </div>
          <div className="question-btn">
            <button className='white' onClick={() => setShowBot(true)}>
              <span>Ask Questions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );


  // If full widget is being used (not embedded), handle popup logic
  if (!isPopup) {
    return (
      <>
        {validSite && showChat && (
          <div >
            <div className="popup-box animated-popup">
              {widget}
            </div>
          </div>
        )}


        {/* Chat window appears when icon is clicked */}

        {/* Optional full-page content */}
        {validSite && showComplain && (
          <Complain isPopup onClose={() => setShowComplain(false)} web_data={web_data} />
        )}
        {validSite && showBot && (
          <Bot isPopup onClose={() => setShowBot(false)} web_data={web_data} />
        )}

      </>
    );
  }

  // If being used inside a popup container (like iframe embed mode)
  return (
    <div className="popup-box">
      <div className="popup-header" style={{ backgroundColor: web_data.color_code, color: web_data.font_color }}>
        <span>Customer Service</span>
        <button className="popup-close" onClick={onClose}>&times;</button>
      </div>
      {validSite === null ? loading : validSite ? widget : botUnavailable}
    </div>
  );
};

export default Mainpg;

