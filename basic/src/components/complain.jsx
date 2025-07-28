import React, { useState, useEffect } from 'react';
import Header from './Header';
// import Footer from './Footer';
import '../styles/complain.css';
import '../styles/popup.css'; 
import boticon from '../assets/submitBot.png'
// import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;


// ————— Validation helpers —————
const hasScript = (str) => /<[^>]*>|script/i.test(str);
const isDigits = (str) => /^[0-9]+$/.test(str);
const isEmail = (str) =>
  /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/.test(str);

const allowedExt = (file) => {
  if(file.includes(".png") || file.includes(".jpg") || file.includes(".jpeg") || file.includes(".pdf"))
  {
    return true;
  }else{
    return false;
  }
};

const initialErrors = {
  order_id: '',
  mobile_number: '',
  email: '',
  message: '',
  attachment: ''
};

const Complain = ({ isPopup = false, onClose, web_data }) => {
  // const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [closeBtnShow, setcloseBtnShow] = useState(true)
  const [ isSubmitScreen ,setisSubmitScreen]=useState(false)
  const [fileName, setFileName] = useState('No file chosen');
  const [formData, setFormData] = useState({
    order_id: '',
    mobile_number: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    if (web_data) {
      document.documentElement.style.setProperty('--bot-bg', web_data.bg_color_code || '#37c673');
      document.documentElement.style.setProperty('--bot-body', web_data.body_color_code || '#0D0D0D');
      document.documentElement.style.setProperty('--bot-accent', web_data.accent_color || '#1F1F1Ff');
    }
  }, [web_data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && allowedExt(file.name)) {
      setImage(file);
      setFileName(file.name)
      console.log(fileName)
      setErrors((prev) => ({ ...prev, attachment: '' }));
    } else {
      setImage(null);
      setFileName('No file chosen')
      setErrors((prev) => ({
        ...prev,
        attachment: 'Allowed: PDF, PNG, JPG'
      }));
    }
  };

  const validate = () => {
    const newErr = { ...initialErrors };

    if (!formData.order_id.trim())
      newErr.order_id = 'Order ID is required';
    else if (formData.order_id.length > 30)
      newErr.order_id = 'Max 30 characters';
    else if (hasScript(formData.order_id))
      newErr.order_id = 'HTML not allowed';

    if (!formData.mobile_number.trim())
      newErr.mobile_number = 'Mobile number required';
    else if (!isDigits(formData.mobile_number))
      newErr.mobile_number = 'Digits only';
    else if (formData.mobile_number.length > 15)
      newErr.mobile_number = 'Max 15 digits';

    if (formData.email && !isEmail(formData.email))
      newErr.email = 'Invalid email address';

    if (!formData.message.trim())
      newErr.message = 'Message is required';
    else if (formData.message.length > 200)
      newErr.message = 'Max 200 characters';
    else if (hasScript(formData.message))
      newErr.message = 'HTML not allowed';

    setErrors(newErr);
    return Object.values(newErr).every((v) => v === '');
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    if (image) payload.append('attachment', image);

    try {
      console.log('Submitting:', Object.fromEntries(payload.entries()));
      // console.log(COMPLAIN_API_URL)
      const res = await fetch('/submit-complaint', {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Submission failed:', data);
        alert(`Error: ${data.message || 'Unknown error'}`);
      } else {
        // alert('Complaint submitted successfully!');
        setisSubmitScreen(true)
        setFormData({ order_id: '', mobile_number: '', email: '', message: '' });
        setImage(null);

      }
    } catch (err) {
      console.error('Error submitting:', err);
      alert('Server error. Please try again later.');
    }
  };


  // ————— Reusable UI Content —————
  const content = (
    <div className="complain">
      <Header web_data={web_data} closeBtnShow={closeBtnShow} onClose={onClose} />
      {/* <h2>Add Complaint</h2> */}
      {isSubmitScreen && (
            <div className="submit">
          <div className="submit-bot-icon">
            <img src="https://d34080pnh6e62j.cloudfront.net/images/VideoOnDemandThumb/1752050599tapBot-thankYou.png" alt="" />
            {/* <img src={boticon} alt="" /> */}
          </div>
          <div className="submit-msg">
            <span>Your query has been submitted</span>
            {/* <br /> */}
            <span>Our representative will contact you shortly</span>
          </div>
    </div>
      )}
      {!isSubmitScreen &&(
        <>
        
        <div className="complainHeader">
          <h3>Add Complaint</h3>
        </div>
        <div className="ComplainBody">
          <form onSubmit={onSubmitHandler} className="complain-form">

            <div className="input-group">
              <p>Order ID
                {/* <span className="star">*</span> */}
              </p>
              <input
                type="text"
                name="order_id"
                value={formData.order_id}
                onChange={handleChange}
                placeholder="Enter Order ID"
                maxLength={30}
              />
              {errors.order_id && <span className="error-msg">{errors.order_id}</span>}
            </div>

            <div className="input-group">
              <p>Mobile Number
                {/* <span className="star">*</span> */}
              </p>
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                maxLength={15}
              />
              {errors.mobile_number && <span className="error-msg">{errors.mobile_number}</span>}
            </div>

            <div className="input-group">
              <p>Email (optional)</p>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                maxLength={255}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>
            <div className="addImg">
              <p>Attach file (optional)</p>
              <div className="file-input-container">
                <label htmlFor="image" className="file-input-label">Choose file</label>
                <span className="file-name">{fileName}</span>
                <input
                  id="image"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  hidden
                  onChange={handleFile}
                />
              </div>
              {errors.attachment && (
                <span className="error-msg">{errors.attachment}</span>
              )}
            </div>
            <div className="input-group">
              <p>Message
                {/* <span className="star">*</span> */}
              </p>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe the issue"
                maxLength={200}
                rows={4}
              />
              {errors.message && <span className="error-msg">{errors.message}</span>}
            </div>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
        </> 
      )}
      {/* <Footer web_data={web_data} /> */}
    </div>
  );

  // return content
  // ————— Conditional Popup Wrapper —————
  if (!isPopup) return content;

  return (

    <div className="popup-box animated-popup" >
      {/* <div className="popup-header">
        <span>Submit Complaint</span>
        <button className="popup-close" onClick={onClose}>&times;</button>
      </div> */}
      {content}
    </div>
  );
};

export default Complain;
