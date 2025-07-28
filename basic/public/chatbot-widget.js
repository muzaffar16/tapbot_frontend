(function () {
  if (typeof window === "undefined") return;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const script =
      document.currentScript || document.querySelector('script[data-licensekey]');
        const website = script.getAttribute("data-website");
        const licenseKey = script.getAttribute("data-licensekey");

    const srcRoot = "http://localhost:5174"; // Change to production later
        //  const srcRoot ='https://tapbot-eight.vercel.app'
    if (!licenseKey) {
      console.error("[TapBot] Missing data-licensekey on script tag");
      return;
    }

    // Inject styles
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --bot-bg: #37c673;
      }

      .tapbot-container {
        position: fixed;
        bottom: 47px;
        right: 62px;
        z-index: 9999;
        width: 18rem;
        height: 25rem;
        aspect-ratio: 7 / 8;
        background: none;
        overflow: hidden;
        display: none;
      }

      .tapbot-container iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      .chat-launcher {
            position: fixed;
            bottom: 0;
            right: 0;
            height: 50px;
            width: 50px;
            background-color: var(--bot-bg);
            border-radius: 50%;
            font-size: 24px;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px 0 var(--bot-bg);
            /* Glow effect */
            cursor: pointer;
            z-index: 9998;
            animation: pulse 2s infinite;
            transition: all 0.3s ease;
            margin: 10px
      }

      .chat-launcher img {
        width: 40px;
        // object-fit: cover;
        border-radius: 50%;
        background: transparent;
      }

      @media (max-width: 430px) {
        .tapbot-container {
            width: 295px;
            height: 406px;
            right: 33px;
            bottom: 72px;
        }
      }

    @media (max-width: 912px) {
        .tapbot-container {
            width: 295px;
            height: 406px;
        }
      }

    `;
    document.head.appendChild(style);

    // Create chatbot container
    const container = document.createElement("div");
    container.className = "tapbot-container";
    container.style.display = "none";

    const iframe = document.createElement("iframe");
    iframe.allow = "clipboard-write";
    iframe.title = "Support Chatbot";
    iframe.src = `${srcRoot}/?website=${encodeURIComponent(website)}&licenseKey=${encodeURIComponent(licenseKey)}`;
    container.appendChild(iframe);
    document.body.appendChild(container);

    // Create launcher button with image
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "chat-launcher";
    toggleBtn.title = "Chat with support";

    const img = document.createElement("img");
    img.src = "https://d34080pnh6e62j.cloudfront.net/images/VideoOnDemandThumb/1752052531boticon.png";
    img.alt = "Chat Icon";
    toggleBtn.appendChild(img);

    toggleBtn.addEventListener("click", () => {
      const isVisible = container.style.display === "block";
      container.style.display = isVisible ? "none" : "block";
    });

    document.body.appendChild(toggleBtn);
  }
})();
