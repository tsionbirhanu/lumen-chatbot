const API_KEY = "api_key";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

async function generateResponse(prompt) {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate response");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function cleanMarkdown(text) {
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`([^`]+)`/g, "$1");
  text = text.replace(/#{1,6}\s/g, "");
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");
  return text.trim();
}

function createMessageElement(content, isUser) {
  const messageDiv = document.createElement("div");
  messageDiv.className = isUser
    ? "message user-message"
    : "message bot-message";

  const iconDiv = document.createElement("div");
  iconDiv.className = "message-icon " + (isUser ? "user-icon" : "bot-icon");
  iconDiv.innerHTML = isUser
    ? '<i class="fas fa-user"></i>'
    : '<i class="fas fa-robot"></i>';

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";
  contentDiv.textContent = content;

  messageDiv.appendChild(iconDiv);
  messageDiv.appendChild(contentDiv);
  return messageDiv;
}

async function handleUserInput() {
  const message = userInput.value.trim();
  if (message === "") return;
  userInput.value = "";
  const userMessageElement = createMessageElement(message, true);
  chatMessages.appendChild(userMessageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  if (window.addMessage) {
    window.addMessage(message, true);
  }

  try {
    const response = await generateResponse(message);
    const cleanedResponse = cleanMarkdown(response);
    const botMessageElement = createMessageElement(cleanedResponse, false);
    chatMessages.appendChild(botMessageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (window.addMessage) {
      window.addMessage(cleanedResponse, false);
    }
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = createMessageElement(
      "Sorry, I encountered an error. Please try again.",
      false
    );
    chatMessages.appendChild(errorMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

sendButton.addEventListener("click", handleUserInput);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleUserInput();
  }
});
