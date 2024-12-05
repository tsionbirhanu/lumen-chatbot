let currentChatId = Date.now().toString();
let isViewingOldChat = false;
const returnBanner = document.createElement('div');
returnBanner.className = 'return-banner';
returnBanner.innerHTML = `
    Viewing Previous Chat
    <button onclick="returnToCurrentChat()">Return to Current Chat</button>
`;
document.body.appendChild(returnBanner);
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
console.log("Initial currentUser:", currentUser);

if (!currentUser) {
    currentUser = {
        username: "user",
        chatHistory: []
    };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
}
if (!currentUser.chatHistory) {
    currentUser.chatHistory = [];
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
}
function saveToHistory(message, isUser) {
    console.log("Saving message to history:", message);
    
    const messageEntry = {
        chatId: currentChatId,
        timestamp: new Date().toISOString(),
        isUser: isUser,
        content: message
    };
    
    currentUser.chatHistory.push(messageEntry);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    console.log("Updated history:", currentUser.chatHistory);
}

function returnToCurrentChat() {
    document.getElementById("chat-messages").innerHTML = "";
    currentChatId = Date.now().toString();
    returnBanner.style.display = "none";
    isViewingOldChat = false;
}
function deleteChatHistory(chatId) {
    console.log("Deleting chat:", chatId);
    currentUser.chatHistory = currentUser.chatHistory.filter(entry => entry.chatId !== chatId);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    showHistory();
}
const originalAddMessage = window.addMessage || function() {};
window.addMessage = function(message, isUser) {
    console.log("addMessage called with:", message, isUser);
    if (originalAddMessage) {
        originalAddMessage(message, isUser);
    }
    if (!isViewingOldChat) {
        saveToHistory(message, isUser);
    }
};
document.getElementById("new-chat-btn").addEventListener("click", startNewChat);
document.getElementById("history-btn").addEventListener("click", showHistory);
const modal = document.getElementById("history-modal");
const closeBtn = document.getElementsByClassName("close")[0];
closeBtn.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = "none";
    }
});

function startNewChat() {
    returnToCurrentChat();
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleString();
}

function showHistory() {
    console.log("Showing history. Current user:", currentUser);
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
    const chats = {};
    if (currentUser.chatHistory && currentUser.chatHistory.length > 0) {
        console.log("Processing chat history:", currentUser.chatHistory);
        currentUser.chatHistory.forEach(entry => {
            if (!chats[entry.chatId]) {
                chats[entry.chatId] = [];
            }
            chats[entry.chatId].push(entry);
        });
        const sortedChats = Object.entries(chats).sort((a, b) => {
            const timestampA = new Date(a[1][0].timestamp).getTime();
            const timestampB = new Date(b[1][0].timestamp).getTime();
            return timestampB - timestampA;
        });
        sortedChats.forEach(([chatId, messages]) => {
            console.log("Creating entry for chat:", chatId);
            const chatDiv = document.createElement("div");
            chatDiv.className = "chat-history-entry";
            const timestamp = new Date(messages[0].timestamp);
            const relativeTime = formatTimestamp(timestamp);
            const messageCount = messages.length;
            const previewDiv = document.createElement("div");
            previewDiv.className = "chat-history-preview";
            const headerDiv = document.createElement("div");
            headerDiv.className = "chat-history-date";
            headerDiv.innerHTML = `${relativeTime} • ${messageCount} messages`;
            previewDiv.appendChild(headerDiv);
            const messagesPreview = document.createElement("div");
            messagesPreview.className = "chat-history-messages";
            const previewMessages = messages.slice(-3).reverse();
            previewMessages.forEach(msg => {
                const messageDiv = document.createElement("div");
                messageDiv.className = `chat-message-preview ${msg.isUser ? 'user' : 'bot'}`;
                const icon = msg.isUser ? '👤' : '🤖';
                messageDiv.innerHTML = `
                    <span class="message-icon">${icon}</span>
                    <span class="message-content">${msg.content.substring(0, 60)}${msg.content.length > 60 ? '...' : ''}</span>
                `;
                messagesPreview.appendChild(messageDiv);
            });
            
            if (messages.length > 3) {
                const moreMessages = document.createElement("div");
                moreMessages.className = "more-messages";
                moreMessages.textContent = `+ ${messages.length - 3} more messages`;
                messagesPreview.appendChild(moreMessages);
            }
            
            previewDiv.appendChild(messagesPreview);
            chatDiv.appendChild(previewDiv);
            const buttonsDiv = document.createElement("div");
            buttonsDiv.className = "history-buttons";
            const loadButton = document.createElement("button");
            loadButton.innerHTML = '<i class="fas fa-folder-open"></i> Load';
            loadButton.className = "load-btn";
            loadButton.onclick = () => loadChat(chatId);
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
            deleteButton.className = "delete-btn";
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this chat?")) {
                    deleteChatHistory(chatId);
                }
            };
            
            buttonsDiv.appendChild(loadButton);
            buttonsDiv.appendChild(deleteButton);
            chatDiv.appendChild(buttonsDiv);
            
            historyList.appendChild(chatDiv);
        });
    } else {
        console.log("No chat history found");
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <p>No chat history available</p>
            </div>
        `;
    }

    modal.style.display = "block";
}

function loadChat(chatId) {
    console.log("Loading chat:", chatId);
    document.getElementById("chat-messages").innerHTML = "";
    currentChatId = chatId;
    isViewingOldChat = true;
    const chatMessages = currentUser.chatHistory.filter(entry => entry.chatId === chatId);
    console.log("Found messages for chat:", chatMessages);
    chatMessages.forEach(entry => {
        displayMessage(entry.content);
    });
    returnBanner.style.display = "block";
    modal.style.display = "none";
}

function displayMessage(message) {
    const messageContainer = document.createElement("div");
    messageContainer.className = "message";
    messageContainer.textContent = message;
    document.getElementById("chat-messages").appendChild(messageContainer);
}
function testSaveMessage() {
    saveToHistory("Test message " + new Date().toLocaleString(), true);
    console.log("Current chat history:", currentUser.chatHistory);
}


