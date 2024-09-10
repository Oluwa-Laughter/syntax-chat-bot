"use strict";

const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatWindow = document.querySelector(".chat-window");

let userRequest;

const API_KEY = "AIzaSyBSVoDpvje6KCtayoxbCze9y12TQNG9DgQ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const typingEffect = function (response, responseEl) {
  const responseText = response.split("");
  responseText.forEach((char, index) => {
    setTimeout(() => {
      responseEl.textContent += char;
    }, 20 * index);
  });
};

const getResponse = async function (incommingMessage) {
  try {
    const replyEl = incommingMessage.querySelector(".chat-details p");
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

const animation = function () {
  const html = `
    <article class="chat-content">
      <article class="chat-details">
        <img src="icons/chatgpt-icon.svg" alt="chatbot-img" />
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
  console.log(incommingMessage);
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

sendBtn.addEventListener("click", handleOutgoingMessage);
