   # Lumen Chatbot

      Overview
Lumen Chatbot is an intelligent, AI-powered chatbot application designed to provide seamless real-time interactions with users. It offers features like secure authentication, Google OAuth integration, personalized chatbot responses, and chat history management, making it an efficient and user-friendly platform for meaningful conversations.

# Features
   Authentication**
   Credential-based Login**: Users can securely log in using their username and password.
   Google OAuth Integration**: Allows users to log in with their Google account for quick and secure access.

## 2. **Chat Functionality**
   Real-time, intelligent responses powered by Google’s Generative Language API.
   Simple and intuitive interface for smooth interaction.

## 3. **Chat History Management**
- Automatically saves chat sessions locally using `localStorage`.
- Allows users to revisit or delete chat history as needed.
- Organizes chats using unique session IDs.

## 4. **New Chat Tab**
- A dedicated "New Chat" button to reset the current session and start fresh.

## 5. **Responsive Design**
- Fully responsive design optimized for desktop, tablet, and mobile devices.
- Visually appealing layout with modern UI/UX principles.


## Installation

### Prerequisites
- A modern web browser (Google Chrome, Firefox, Edge, etc.)
- Local development environment with a web server (optional)

### Steps
1. **Clone the Repository**
   bash
   git clone https://github.com/your-repository/lumen-chatbot.git
  

2. **Navigate to the Project Folder**
   bash
   cd lumen-chatbot
  

3. **Run the Application**
   - Open `index.html` in your preferred browser.


## File Structure

Lumen-Chatbot/
├── index.html         # Main welcome page
├── login.html         # Login page
├── signup.html        # Signup page
├── chatbot.html       # Chat interface
├── css/
│   └── style.css     # Main styling file
├── images/
│   └── bot.jpg        # Favicon and assets
├── js/
│   ├── login.js      # Handles authentication
│   ├── chatbot.js    # Manages chat sessions and history
│   └── script.js     # Handles AI responses




## Usage

1. **Login or Sign Up**
   - Navigate to the login page (`login.html`) and log in using your credentials or Google account.

2. **Start Chatting**
   - Interact with the chatbot on the chat interface (`chatbot.html`). Type your queries, and the AI will respond in real time.

3. **Manage Chat History**
   - Use the "History" button to view, load, or delete past chat sessions.

4. **Start a New Chat**
   - Click the "New Chat" button to clear the current session and begin fresh.



## Technologies Used
- **Frontend**: HTML, CSS (with responsive design)
- **JavaScript**: For dynamic content, chat management, and API integration
- **Google Identity Services**: For OAuth-based login
- **Google Generative Language API**: For AI-powered responses


## Best Practices Followed
1. **Secure Authentication**: Used credential-based and OAuth login for enhanced security.
2. **Responsive UI**: Ensured a seamless experience across devices.
3. **Error Handling**: Added meaningful error messages for failed login attempts, API errors, etc.
4. **Modular Code**: Organized code into separate scripts for authentication, chat handling, and AI logic.
5. **Scalability**: Built a scalable structure to accommodate additional features in the future.


## Future Improvements
- Add backend integration for persistent chat storage.
- Enable user profile management.
- Include support for voice-based interaction.
- Provide more AI response options using advanced language models.


## License
-This project is licensed under the MIT License. See `LICENSE` for details.


## Contact
For any questions or feedback, feel free to connect:
- **LinkedIn**: [Tsion Birhanu](https://www.linkedin.com/in/tsion-birhanu-76988a338/)
- **GitHub**: [Nahleyed](https://github.com/nahleyed)
