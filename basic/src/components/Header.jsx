import React, { useEffect, useState } from 'react';
import "../styles/header.css";
import '../styles/popup.css';
import tapShopIcon from '../assets/tapShopIcon.png';
import boticon from '../assets/boticon.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header = ({ web_data, closeBtnShow, onClose, showCat = false, onBackClick }) => {
  useEffect(() => {
    if (web_data) {
      document.documentElement.style.setProperty('--bot-bg', web_data.bg_color_code || '#37c673');
      document.documentElement.style.setProperty('--bot-body', web_data.body_color_code || '#0D0D0D');
      document.documentElement.style.setProperty('--bot-accent', web_data.accent_color || '#1F1F1Ff');
    }
  }, [web_data]);

  return (
    <div className="chat-header">
      {closeBtnShow && (
        <div className="closeBtn">
          <button
            className="popup-close"
            onClick={showCat ? onBackClick : onClose}
          >
            <i className="bi bi-arrow-left-short"></i>
          </button>
        </div>
      )}
      <div className="logo">
        <img src={boticon} alt="Bot Icon" />
      </div>
      <div className="TapShop-logo">
        <img src={web_data.logo_url} alt="TapShop Logo" />
      </div>
    </div>
  );
};

export default Header;
