// The code is executed in strict mode, which helps catch common coding mistakes and unsafe actions(like using undeclared variables)
"use strict";

//Dom Elements
const body = document.querySelector("body");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatWindow = document.querySelector(".chat-window");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userRequest;

const typingEffect = function (response, responseEl) {
  const responseText = response.split("");
  responseText.forEach((char, index) => {
    setTimeout(() => {
      responseEl.textContent += char;
    }, 20 * index);
  });
};

// handles An api response
const getResponse = async function (incommingMessage) {
  try {
    const replyEl = incommingMessage.querySelector(".chat-details p");

    const API_KEY = "";

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userRequest }] }],
      }),
    });

    const data = await response.json();

    const apiResponse = data?.candidates[0]?.content?.parts[0]?.text;
    typingEffect(apiResponse, replyEl);
  } catch (error) {
    console.log(error);
  } finally {
    incommingMessage.querySelector(".typing-animation").remove();
  }
};

// handles the creates and inserts an incoming message element with a loading animation
const animation = function () {
  const html = `
    <article class="chat-content">
      <article class="chat-details">
        <img src="icons/google-gemini-icon.svg" alt="chatbot-img" />
        <p></p>
        <article class="typing-animation">
            <article class="typing-dot" style="--delay: 0.2s"></article>
            <article class="typing-dot" style="--delay: 0.3s"></article>
            <article class="typing-dot" style="--delay: 0.4s"></article>
          </article>
        </article>
        <span class="copy"><i class="fa-regular fa-copy"></i></span>
      </article>
    </article>
  `;

  const incommingMessage = createElement(html, "incoming");
  chatWindow.appendChild(incommingMessage);
  getResponse(incommingMessage);

  const copyToClipboard = incommingMessage.querySelector(".copy");
  copyToClipboard.addEventListener("click", () => {
    const text = incommingMessage.querySelector(".chat-details p").textContent;
    navigator.clipboard.writeText(text);
    copyToClipboard.innerHTML = `<i class="fa-regular fa-check-circle"></i>`;
    setTimeout(() => {
      copyToClipboard.innerHTML = `<i class="fa-regular fa-copy"></i>`;
    }, 500);
  });
};

// handles the creation of a new DOM element
const createElement = function (html, className) {
  const element = document.createElement("article");
  element.innerHTML = html;
  element.classList.add("chat", className);
  return element;
};

const handleOutgoingMessage = () => {
  userRequest = chatInput.value.trim();
  if (!userRequest) return;
  const html = `
   <article class="chat-content">
      <article class="chat-details">
        <img src="icons/user-icon.svg" alt="user-img" />
        <p>${userRequest}</p>
      </article>
    </article>
  `;

  const outGoingMessage = createElement(html, "outgoing");
  chatWindow.appendChild(outGoingMessage);
  setTimeout(animation, 500);
};

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey && chatInput.value.trim() !== "") {
    handleOutgoingMessage();
    e.target.value = "";
    e.preventDefault();
  }
});

deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    chatWindow.innerHTML = " ";
  }
});

sendBtn.addEventListener("click", function () {
  handleOutgoingMessage();
  chatInput.value = "";
});

const handleTheme = function () {
  body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
};

themeButton.addEventListener("click", handleTheme);

if (localStorage.getItem("darkMode") === "true") {
  handleTheme();
}
