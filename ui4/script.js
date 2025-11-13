const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const closeBtn = document.getElementById("close-btn");
const refreshBtn = document.getElementById("refresh-btn");
const chatbot = document.getElementById("chatbot");
const toggleBtn = document.getElementById("chat-toggle");

let hasSuggested = false;

// ✅ Embed your CSV Q&A data (simplified)
const qaData = [
  { q: "what is gifty", a: "Gifty is an AI-powered assistant that helps you find perfect gifts for any occasion 🎁." },
  { q: "who created you", a: "I was created by the ScriptBees team to make gifting smarter and easier! 💡" },
  { q: "how to use gifty", a: "Simply tell me the occasion or person, and I’ll suggest thoughtful gifts instantly." },
  { q: "what can you do", a: "I can suggest personalized gifts, share product links, and help you explore gift ideas for birthdays, anniversaries, farewells, and more!" },
  { q: "hi", a: "Hello! 👋 I’m Gifty — your personal gifting assistant. What are you celebrating today?" },
  { q: "hello", a: "Hi there! 🌟 Tell me your occasion and I’ll find some amazing gift options for you!" },
  // 👉 You can add more Q&A pairs from your CSV here manually
];

// 🧹 On page load — reset chat
window.addEventListener("load", () => {
  resetChat();
  toggleBtn.style.display = "none";
});

// Events
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
closeBtn.addEventListener("click", () => {
  chatbot.style.display = "none";
  toggleBtn.style.display = "flex";
});
toggleBtn.addEventListener("click", () => {
  chatbot.style.display = "flex";
  toggleBtn.style.display = "none";
});
refreshBtn.addEventListener("click", resetChat);

// 💬 Reset Chat
function resetChat() {
  chatBox.innerHTML = "";
  hasSuggested = false;
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {}
  addBotMessage(`
    <strong>I am Gifty AI 😊</strong><br>
    I can recommend amazing gift ideas for any occasion — just ask me about an event or celebration!
  `);
}

function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.classList.add("user-message");
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addBotMessage(html) {
  const msg = document.createElement("div");
  msg.classList.add("bot-message");
  msg.innerHTML = html;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;
  addUserMessage(userMessage);
  input.value = "";

  const thinking = document.createElement("div");
  thinking.classList.add("bot-message");
  thinking.textContent = "💭 Gifty is thinking...";
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    thinking.remove();
    handleUserMessage(userMessage);
  }, 600);
}

// 🧠 Handle user input
function handleUserMessage(userMessage) {
  const lower = userMessage.toLowerCase().trim();

  // 1️⃣ Check direct Q&A matches
  const qaMatch = qaData.find((pair) => lower.includes(pair.q));
  if (qaMatch) {
    addBotMessage(qaMatch.a);
    return;
  }

  // 2️⃣ Gift suggestion detection
  const giftWords = ["birthday", "anniversary", "valentine", "farewell", "annual", "gift", "occasion", "event", "present", "party"];
  const isGift = giftWords.some((w) => lower.includes(w));

  if (isGift) {
    if (!hasSuggested) {
      addBotMessage("Got it! Let me find some great gift ideas for that 💡");
      setTimeout(showButtons, 600);
      hasSuggested = true;
    } else {
      showGiftSuggestions(userMessage);
    }
  } else {
    addBotMessage("Tell me what you’re celebrating, and I’ll help you find the perfect present! 💡");
  }
}

// 🔘 Occasion Buttons
function showButtons() {
  chatBox.insertAdjacentHTML(
    "beforeend",
    `
    <div class="bot-message">💡 Here are some popular gift occasions you can explore 🎁</div>
    <div class="button-container">
      <button onclick="selectOccasion('Birthday')">🎂 Birthday</button>
      <button onclick="selectOccasion('Anniversary')">💖 Anniversary</button>
      <button onclick="selectOccasion('Valentine’s Day')">❤️ Valentine’s Day</button>
      <button onclick="selectOccasion('Farewell')">👋 Farewell</button>
      <button onclick="selectOccasion('Annual Day')">🏆 Annual Day</button>
    </div>`
  );
  chatBox.scrollTop = chatBox.scrollHeight;
}

function selectOccasion(occasion) {
  addUserMessage(occasion);
  showGiftSuggestions(occasion);
}

// 🎁 Gift Suggestions
function showGiftSuggestions(text) {
  const lower = text.toLowerCase();
  let occasion = "Gift Ideas";
  let links = [];

  if (lower.includes("birthday")) {
    occasion = "Birthday";
    links = [
      { label: "🎂 Birthday Explosion Box – Amazon", url: "https://www.amazon.in/s?k=birthday+explosion+box" },
      { label: "🎁 Personalized Birthday Mug – Amazon", url: "https://www.amazon.in/s?k=personalized+birthday+mug" },
      { label: "🎉 Birthday Gift Combo – Flipkart", url: "https://www.flipkart.com/search?q=birthday+gift+combo" },
      { label: "🎈 Birthday Greeting Card – Flipkart", url: "https://www.flipkart.com/search?q=birthday+greeting+card" },
    ];
  } else if (lower.includes("anniversary")) {
    occasion = "Anniversary";
    links = [
      { label: "💞 Couple Frame – Amazon", url: "https://www.amazon.in/s?k=couple+photo+frame+anniversary" },
      { label: "💖 Heart LED Lamp – Amazon", url: "https://www.amazon.in/s?k=heart+led+lamp+anniversary" },
      { label: "💝 Romantic Gift Box – Flipkart", url: "https://www.flipkart.com/search?q=anniversary+gift+box" },
      { label: "🕯️ Candle Set – Flipkart", url: "https://www.flipkart.com/search?q=romantic+candle+set" },
    ];
  } else if (lower.includes("valentine")) {
    occasion = "Valentine’s Day";
    links = [
      { label: "❤️ Valentine Gift Hamper – Amazon", url: "https://www.amazon.in/s?k=valentine+gift+hamper" },
      { label: "💌 Love Explosion Box – Amazon", url: "https://www.amazon.in/s?k=love+explosion+box" },
      { label: "💖 Valentine Combo – Flipkart", url: "https://www.flipkart.com/search?q=valentine+gift+combo" },
      { label: "🌹 Rose Teddy Gift – Flipkart", url: "https://www.flipkart.com/search?q=rose+teddy+gift" },
    ];
  } else if (lower.includes("farewell")) {
    occasion = "Farewell";
    links = [
      { label: "👋 Goodbye Mug – Amazon", url: "https://www.amazon.in/s?k=farewell+mug" },
      { label: "📖 Farewell Diary – Amazon", url: "https://www.amazon.in/s?k=farewell+diary" },
      { label: "🎁 Farewell Combo – Flipkart", url: "https://www.flipkart.com/search?q=farewell+gift+combo" },
      { label: "🖋️ Pen Set – Flipkart", url: "https://www.flipkart.com/search?q=pen+set+gift" },
    ];
  } else if (lower.includes("annual")) {
    occasion = "Annual Day";
    links = [
      { label: "🏆 Corporate Trophy – Amazon", url: "https://www.amazon.in/s?k=corporate+trophy+gift" },
      { label: "🎖️ Appreciation Plaque – Amazon", url: "https://www.amazon.in/s?k=appreciation+plaque+award" },
      { label: "🎁 Employee Gift Set – Flipkart", url: "https://www.flipkart.com/search?q=employee+gift+set" },
      { label: "🕯️ Decorative Desk Gift – Flipkart", url: "https://www.flipkart.com/search?q=office+desk+decor+gift" },
    ];
  }

  const html = `
    Here are some great <b>${occasion}</b> ideas 🎁:
    <ul>
      ${links.map(l => `<li><a href="${l.url}" target="_blank">${l.label}</a></li>`).join("")}
    </ul>`;
  addBotMessage(html);
}

