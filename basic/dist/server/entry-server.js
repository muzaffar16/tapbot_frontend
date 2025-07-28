import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server.mjs";
const boticon = "/assets/boticon-CzMHtUYz.png";
const Header = ({ web_data, closeBtnShow, onClose, showCat = false, onBackClick }) => {
  useEffect(() => {
    if (web_data) {
      document.documentElement.style.setProperty("--bot-bg", web_data.bg_color_code || "#37c673");
      document.documentElement.style.setProperty("--bot-body", web_data.body_color_code || "#0D0D0D");
      document.documentElement.style.setProperty("--bot-accent", web_data.accent_color || "#1F1F1Ff");
    }
  }, [web_data]);
  return /* @__PURE__ */ jsxs("div", { className: "chat-header", children: [
    closeBtnShow && /* @__PURE__ */ jsx("div", { className: "closeBtn", children: /* @__PURE__ */ jsx(
      "button",
      {
        className: "popup-close",
        onClick: showCat ? onBackClick : onClose,
        children: /* @__PURE__ */ jsx("i", { className: "bi bi-arrow-left-short" })
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "logo", children: /* @__PURE__ */ jsx("img", { src: boticon, alt: "Bot Icon" }) }),
    /* @__PURE__ */ jsx("div", { className: "TapShop-logo", children: /* @__PURE__ */ jsx("img", { src: web_data.logo_url, alt: "TapShop Logo" }) })
  ] });
};
const Footer = ({ web_data, isInternet }) => {
  useEffect(() => {
    if (web_data) {
      document.documentElement.style.setProperty("--bot-bg", web_data.bg_color_code || "#37c673");
      document.documentElement.style.setProperty("--bot-body", web_data.body_color_code || "#0D0D0D");
      document.documentElement.style.setProperty("--bot-accent", web_data.accent_color || "#1F1F1Ff");
    }
  }, [web_data]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "display-message", children: [
    /* @__PURE__ */ jsx("div", { className: "img", children: /* @__PURE__ */ jsx("img", { src: "https://tapbot-website-info.s3.eu-north-1.amazonaws.com/uploads/botVid.gif", alt: "" }) }),
    !isInternet && /* @__PURE__ */ jsx("span", { children: "No Internet Connection" }),
    isInternet && /* @__PURE__ */ jsxs("span", { children: [
      "Welcome to the ",
      /* @__PURE__ */ jsx("span", { className: "title", children: web_data.websiteName }),
      " Customer Service!!"
    ] })
  ] }) });
};
const hasScript = (str) => /<[^>]*>|script/i.test(str);
const isDigits = (str) => /^[0-9]+$/.test(str);
const isEmail = (str) => /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/.test(str);
const allowedExt = (file) => {
  if (file.includes(".png") || file.includes(".jpg") || file.includes(".jpeg") || file.includes(".pdf")) {
    return true;
  } else {
    return false;
  }
};
const initialErrors = {
  order_id: "",
  mobile_number: "",
  email: "",
  message: "",
  attachment: ""
};
const Complain = ({ isPopup = false, onClose, web_data }) => {
  const [image, setImage] = useState(null);
  const [closeBtnShow, setcloseBtnShow] = useState(true);
  const [isSubmitScreen, setisSubmitScreen] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const [formData, setFormData] = useState({
    order_id: "",
    mobile_number: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState(initialErrors);
  useEffect(() => {
    if (web_data) {
      document.documentElement.style.setProperty("--bot-bg", web_data.bg_color_code || "#37c673");
      document.documentElement.style.setProperty("--bot-body", web_data.body_color_code || "#0D0D0D");
      document.documentElement.style.setProperty("--bot-accent", web_data.accent_color || "#1F1F1Ff");
    }
  }, [web_data]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && allowedExt(file.name)) {
      setImage(file);
      setFileName(file.name);
      console.log(fileName);
      setErrors((prev) => ({ ...prev, attachment: "" }));
    } else {
      setImage(null);
      setFileName("No file chosen");
      setErrors((prev) => ({
        ...prev,
        attachment: "Allowed: PDF, PNG, JPG"
      }));
    }
  };
  const validate = () => {
    const newErr = { ...initialErrors };
    if (!formData.order_id.trim())
      newErr.order_id = "Order ID is required";
    else if (formData.order_id.length > 30)
      newErr.order_id = "Max 30 characters";
    else if (hasScript(formData.order_id))
      newErr.order_id = "HTML not allowed";
    if (!formData.mobile_number.trim())
      newErr.mobile_number = "Mobile number required";
    else if (!isDigits(formData.mobile_number))
      newErr.mobile_number = "Digits only";
    else if (formData.mobile_number.length > 15)
      newErr.mobile_number = "Max 15 digits";
    if (formData.email && !isEmail(formData.email))
      newErr.email = "Invalid email address";
    if (!formData.message.trim())
      newErr.message = "Message is required";
    else if (formData.message.length > 200)
      newErr.message = "Max 200 characters";
    else if (hasScript(formData.message))
      newErr.message = "HTML not allowed";
    setErrors(newErr);
    return Object.values(newErr).every((v) => v === "");
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    if (image) payload.append("attachment", image);
    try {
      console.log("Submitting:", Object.fromEntries(payload.entries()));
      const res = await fetch("/submit-complaint", {
        method: "POST",
        body: payload
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Submission failed:", data);
        alert(`Error: ${data.message || "Unknown error"}`);
      } else {
        setisSubmitScreen(true);
        setFormData({ order_id: "", mobile_number: "", email: "", message: "" });
        setImage(null);
      }
    } catch (err) {
      console.error("Error submitting:", err);
      alert("Server error. Please try again later.");
    }
  };
  const content = /* @__PURE__ */ jsxs("div", { className: "complain", children: [
    /* @__PURE__ */ jsx(Header, { web_data, closeBtnShow, onClose }),
    isSubmitScreen && /* @__PURE__ */ jsxs("div", { className: "submit", children: [
      /* @__PURE__ */ jsx("div", { className: "submit-bot-icon", children: /* @__PURE__ */ jsx("img", { src: "https://d34080pnh6e62j.cloudfront.net/images/VideoOnDemandThumb/1752050599tapBot-thankYou.png", alt: "" }) }),
      /* @__PURE__ */ jsxs("div", { className: "submit-msg", children: [
        /* @__PURE__ */ jsx("span", { children: "Your query has been submitted" }),
        /* @__PURE__ */ jsx("span", { children: "Our representative will contact you shortly" })
      ] })
    ] }),
    !isSubmitScreen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "complainHeader", children: /* @__PURE__ */ jsx("h3", { children: "Add Complaint" }) }),
      /* @__PURE__ */ jsx("div", { className: "ComplainBody", children: /* @__PURE__ */ jsxs("form", { onSubmit: onSubmitHandler, className: "complain-form", children: [
        /* @__PURE__ */ jsxs("div", { className: "input-group", children: [
          /* @__PURE__ */ jsx("p", { children: "Order ID" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "order_id",
              value: formData.order_id,
              onChange: handleChange,
              placeholder: "Enter Order ID",
              maxLength: 30
            }
          ),
          errors.order_id && /* @__PURE__ */ jsx("span", { className: "error-msg", children: errors.order_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "input-group", children: [
          /* @__PURE__ */ jsx("p", { children: "Mobile Number" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "tel",
              name: "mobile_number",
              value: formData.mobile_number,
              onChange: handleChange,
              placeholder: "Enter Mobile Number",
              maxLength: 15
            }
          ),
          errors.mobile_number && /* @__PURE__ */ jsx("span", { className: "error-msg", children: errors.mobile_number })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "input-group", children: [
          /* @__PURE__ */ jsx("p", { children: "Email (optional)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              name: "email",
              value: formData.email,
              onChange: handleChange,
              placeholder: "Enter Email",
              maxLength: 255
            }
          ),
          errors.email && /* @__PURE__ */ jsx("span", { className: "error-msg", children: errors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "addImg", children: [
          /* @__PURE__ */ jsx("p", { children: "Attach file (optional)" }),
          /* @__PURE__ */ jsxs("div", { className: "file-input-container", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "image", className: "file-input-label", children: "Choose file" }),
            /* @__PURE__ */ jsx("span", { className: "file-name", children: fileName }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "image",
                type: "file",
                accept: ".pdf,.png,.jpg,.jpeg",
                hidden: true,
                onChange: handleFile
              }
            )
          ] }),
          errors.attachment && /* @__PURE__ */ jsx("span", { className: "error-msg", children: errors.attachment })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "input-group", children: [
          /* @__PURE__ */ jsx("p", { children: "Message" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              name: "message",
              value: formData.message,
              onChange: handleChange,
              placeholder: "Describe the issue",
              maxLength: 200,
              rows: 4
            }
          ),
          errors.message && /* @__PURE__ */ jsx("span", { className: "error-msg", children: errors.message })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "submit-btn", children: "Submit" })
      ] }) })
    ] })
  ] });
  if (!isPopup) return content;
  return /* @__PURE__ */ jsx("div", { className: "popup-box animated-popup", children: content });
};
const categories = [
  { label: "Pricing", msg: "Suggest all possible questions/categories about Pricing and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting" },
  { label: "Sales & Offers", msg: "show all possible product which you offer and when user select it than share information regarding this to user, and tell user enter 1 for this ,2 for that and so on, and start with greeting" },
  { label: "Availability", msg: "Suggest all possible questions/categories about availability and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting" },
  { label: "Redemption Help", msg: "Suggest all possible questions/categories about Redemption Help and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting" },
  { label: "Payment Methods", msg: "Which payment methods are accepted?" },
  { label: "Complain", msg: " ask what issue they are facing in a kind, helpful tone, Suggest all possible questions/categories about Complain or issue and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting" },
  { label: "Ask Help", msg: "Print only a welcome msg to user" }
];
const Bot = ({ isPopup = false, onClose, web_data }) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading2, setLoading] = useState(false);
  const [sessionId] = useState(() => Date.now().toString());
  const [allowInput, setAllowInput] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [closeBtnShow, setcloseBtnShow] = useState(true);
  useEffect(() => {
    if (web_data) {
      document.documentElement.style.setProperty("--bot-bg", web_data.bg_color_code || "#37c673");
      document.documentElement.style.setProperty("--bot-body", web_data.body_color_code || "#0D0D0D");
      document.documentElement.style.setProperty("--bot-accent", web_data.accent_color || "#1F1F1Ff");
    }
  }, [web_data]);
  const cleanMessage = (text) => text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\\n/g, "<br />").trim();
  const handleMainMenuClick = () => {
    setMessages((prev) => [...prev, { sender: "bot", text: "🔁 Returned to Main Menu" }]);
    setTimeout(() => {
      setMessages([]);
      setQuery("");
      setAllowInput(false);
      setShowButtons(true);
    }, 1500);
  };
  const handleSend = async (text = query, showUserMsg = true) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (trimmed === "0") return handleMainMenuClick();
    if (showUserMsg) {
      setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    }
    setQuery("");
    setLoading(true);
    setShowButtons(false);
    try {
      const res = await fetch(`/chat-relay?websiteName=${web_data.websiteName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId })
      });
      const data = await res.json();
      const botMessage = `${data.reply}<br /><br /><em>Enter <strong>0</strong> for 🔁 Go to Main Menu</em>`;
      setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Error talking to server." }]);
    } finally {
      setLoading(false);
    }
  };
  const handleCategoryClick = (msg) => {
    handleSend(msg, false);
    setAllowInput(true);
    setShowButtons(false);
  };
  const renderMessages = () => messages.map((m, i) => {
    return /* @__PURE__ */ jsxs("div", { className: m.sender === "user" ? "user-msg" : "bot-msg", children: [
      m.sender === "bot" && /* @__PURE__ */ jsx("div", { className: "botIcon", children: /* @__PURE__ */ jsx("img", { src: boticon, alt: "Bot" }) }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "message-text",
          dangerouslySetInnerHTML: {
            __html: m.sender === "user" ? m.text : cleanMessage(m.text)
          }
        }
      )
    ] }, i);
  });
  const renderButtons = () => showButtons && /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "msg", children: /* @__PURE__ */ jsx("span", { children: "How may I assist you today?" }) }),
    /* @__PURE__ */ jsx("div", { className: "category-buttons", children: categories.map(({ label, msg }) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => handleCategoryClick(msg),
        children: /* @__PURE__ */ jsx("span", { children: label })
      },
      label
    )) })
  ] });
  const goBackToCategories = () => {
    setMessages([]);
    setQuery("");
    setLoading(false);
    setAllowInput(false);
    setShowButtons(true);
  };
  const content = /* @__PURE__ */ jsxs("div", { className: "msg-window", children: [
    /* @__PURE__ */ jsx(
      Header,
      {
        web_data,
        closeBtnShow,
        onClose,
        showCat: !showButtons,
        onBackClick: goBackToCategories
      }
    ),
    !showButtons && /* @__PURE__ */ jsx("div", { className: "header", children: /* @__PURE__ */ jsx("div", { className: "header-time", children: (/* @__PURE__ */ new Date()).toLocaleString("en-US", { weekday: "long", hour: "2-digit", minute: "2-digit" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "chat-window", children: loading2 ? /* @__PURE__ */ jsx("p", { className: "typing-indicator", children: "tapBot is typing…" }) : showButtons ? renderButtons() : renderMessages() }),
    allowInput && /* @__PURE__ */ jsx("div", { className: "input-border", children: /* @__PURE__ */ jsxs("div", { className: "user-input", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: "Type Your Message",
          className: "input-box",
          onKeyDown: (e) => e.key === "Enter" && handleSend()
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "send-btn", onClick: () => handleSend(), children: /* @__PURE__ */ jsx("i", { className: "bi bi-send-fill" }) })
    ] }) })
  ] });
  return !isPopup ? content : /* @__PURE__ */ jsx("div", { className: "popup-box animated-popup", children: content });
};
const Mainpg = ({ isPopup = true, onClose, initialConfig, ssrData }) => {
  const [config, setConfig] = useState(initialConfig);
  const [website, setWebsite] = useState("");
  const [licenseKey, setlicenseKey] = useState("");
  const [showComplain, setShowComplain] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [validSite, setValidSite] = useState(null);
  const [isInternet, setisInternet] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [web_data, setweb_data] = useState({
    websiteName: ssrData.webData.websiteName,
    bg_color_code: ssrData.webData.bg_color_code,
    color_code: ssrData.webData.body_color_code,
    font_color: ssrData.webData.accent_color,
    logo_url: ssrData.webData.logo_url,
    discription: ssrData.webData.discription
  });
  useEffect(() => {
    setValidSite(ssrData.isValid || false);
    document.documentElement.style.setProperty("--bot-bg", web_data.bg_color_code);
    document.documentElement.style.setProperty("--bot-body", web_data.color_code);
    document.documentElement.style.setProperty("--bot-accent", web_data.font_color);
  }, [web_data]);
  const widget = /* @__PURE__ */ jsxs("div", { className: "widget", children: [
    /* @__PURE__ */ jsx(Header, { web_data }),
    /* @__PURE__ */ jsx(Footer, { web_data, isInternet }),
    isInternet && /* @__PURE__ */ jsxs("div", { className: "chat-body", children: [
      /* @__PURE__ */ jsx("div", { className: "complain-btn", children: /* @__PURE__ */ jsx("button", { onClick: () => setShowComplain(true), children: /* @__PURE__ */ jsx("span", { children: "Add Complain" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "question-btn", children: /* @__PURE__ */ jsx("button", { className: "white", onClick: () => setShowBot(true), children: /* @__PURE__ */ jsx("span", { children: "Ask Questions" }) }) })
    ] })
  ] });
  if (!isPopup) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      validSite && showChat && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "popup-box animated-popup", children: widget }) }),
      validSite && showComplain && /* @__PURE__ */ jsx(Complain, { isPopup: true, onClose: () => setShowComplain(false), web_data }),
      validSite && showBot && /* @__PURE__ */ jsx(Bot, { isPopup: true, onClose: () => setShowBot(false), web_data })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "popup-box", children: [
    /* @__PURE__ */ jsxs("div", { className: "popup-header", style: { backgroundColor: web_data.color_code, color: web_data.font_color }, children: [
      /* @__PURE__ */ jsx("span", { children: "Customer Service" }),
      /* @__PURE__ */ jsx("button", { className: "popup-close", onClick: onClose, children: "×" })
    ] }),
    validSite === null ? loading : validSite ? widget : botUnavailable
  ] });
};
const isSSR = typeof window === "undefined";
const App = ({ ssrData, initialConfig }) => {
  const Router = isSSR ? StaticRouter : BrowserRouter;
  const routerProps = isSSR ? { location: "/" } : {};
  useEffect(() => {
  }, []);
  return /* @__PURE__ */ jsx(Router, { ...routerProps, children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/",
        element: /* @__PURE__ */ jsx(
          Mainpg,
          {
            isPopup: false,
            initialConfig,
            ssrData
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(Route, { path: "/bot", element: /* @__PURE__ */ jsx(Bot, { isPopup: false, ssrData }) }),
    /* @__PURE__ */ jsx(Route, { path: "/complain", element: /* @__PURE__ */ jsx(Complain, { isPopup: false, ssrData }) })
  ] }) });
};
function render({ url, initialConfig, ssrData }) {
  return renderToString(/* @__PURE__ */ jsx(App, { initialConfig, ssrData }));
}
export {
  render
};
