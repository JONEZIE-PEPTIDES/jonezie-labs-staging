(() => {
  const websiteId = '17a74d8e-fc64-43cc-83e4-ea5b69b5835e';
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(websiteId)) return;
  if (document.getElementById('jonezie-crisp-chat')) return;

  window.$crisp = window.$crisp || [];
  window.CRISP_WEBSITE_ID = websiteId;

  const style = document.createElement('style');
  style.id = 'jonezie-chat-launcher-style';
  style.textContent = `
    #crisp-chatbox [data-id="chat_opened"],
    #crisp-chatbox [data-id="chat_closed"] {
      background: linear-gradient(135deg, #8fdfff 0%, #b8d8ff 35%, #d39ce6 65%, #ff5ba7 100%) !important;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, .8), 0 8px 20px rgba(0, 0, 0, .24) !important;
    }
    #crisp-chatbox [data-id="chat_opened"] > span:first-child,
    #crisp-chatbox [data-id="chat_closed"] > span:first-child {
      filter: brightness(0) opacity(.82);
    }
    #crisp-chatbox [class*="--visitor"][class*="--text"] > span > span > span:has(> span > span[dir="auto"]) {
      background: #9ff3d2 !important;
      color: #17313b !important;
    }
    #crisp-chatbox [class*="--visitor"][class*="--text"] span[dir="auto"],
    #crisp-chatbox [class*="--visitor"][class*="--text"] span[dir="auto"] a {
      color: #17313b !important;
    }
  `;
  document.head.appendChild(style);

  const script = document.createElement('script');
  script.id = 'jonezie-crisp-chat';
  script.src = 'https://client.crisp.chat/l.js';
  script.async = true;
  document.head.appendChild(script);
})();
