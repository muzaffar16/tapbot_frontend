import { useEffect } from 'react';
import "../styles/footer.css";
import footerImg from '../assets/footerimg.png'
// import footerVid from 'https://tapbot-website-info.s3.eu-north-1.amazonaws.com/uploads/botVid.gif'
const Footer = ({ web_data ,isInternet}) => {

  useEffect(() => {
    if (web_data) {
  document.documentElement.style.setProperty('--bot-bg', web_data.bg_color_code || '#37c673');
      document.documentElement.style.setProperty('--bot-body', web_data.body_color_code || '#0D0D0D');
      document.documentElement.style.setProperty('--bot-accent', web_data.accent_color || '#1F1F1Ff');
    }
  }, [web_data]);

  return (
    <>
      <div className="display-message">
         <div className="img">
          {/* <img src={footerImg} alt="" /> */}
          <img src='https://tapbot-website-info.s3.eu-north-1.amazonaws.com/uploads/botVid.gif' alt="" />
          </div>
        {!isInternet &&(
          <span >No Internet Connection</span>
        )}
        {isInternet &&(
          <span>Welcome to the <span className="title">{web_data.websiteName}</span> Customer Service!!</span>
        )}
      </div>
    </>
  );
};

export default Footer;
