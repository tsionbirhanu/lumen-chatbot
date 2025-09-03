"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  User,
  Copy,
  Check,
  Send,
  Sun,
  Moon,
  Settings,
  MessageSquare,
  Plus,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";


interface StaticMessage {
  id: string;
  content: string;
  is_user: boolean;
  created_at: string;
}

const mockUser = {
  username: "User",
  email: "user@example.com",
};

const mockSessions = [
  { id: "1", title: "Project Proposal Draft" },
  { id: "2", title: "Code Refactoring" },
  { id: "3", title: "Marketing Strategy" },
  { id: "4", title: "Explain Quantum Computing" },
];


const mockStreamResponse = (content: string) => {
  const responses = {
    "Write a professional email about project deadline.":
      "Subject: Important: Upcoming Project X Deadline\n\nHi Team,\n\nJust a friendly reminder that the deadline for Project X is approaching. Please ensure all tasks are on track to be completed by [Date]. Let's continue to collaborate effectively to meet our goal. Thanks for all your hard work!\n\nBest,\n[Your Name]",
    "Help me fix a React rendering bug.":
      "To debug a React re-rendering issue, first check if you have any unnecessary state updates within a useEffect or event handler. Use the React DevTools profiler to pinpoint which component is re-rendering. You might also want to ensure you're memoizing expensive computations with `useMemo` and preventing prop-based re-renders with `React.memo`.",
    "Explain machine learning in simple terms.":
      "Machine learning is a field of artificial intelligence that teaches computers to learn from data without being explicitly programmed. It's like teaching a child by showing them many examples. For instance, to teach a computer to recognize a cat, you show it thousands of pictures of cats and non-cats. The computer then 'learns' the patterns that define a cat.",
    "Suggest features for a language learning app.":
      "Here are some creative ideas for a language learning app:\n\n1.  **AI Conversation Partner:** A chatbot that can act as a native speaker for real-time practice.\n2.  **Cultural Immersion Quests:** Gamified lessons that teach language through cultural scenarios.\n3.  **Phrasebook with Pronunciation Coach:** An interactive phrasebook that uses AI to analyze your pronunciation and give real-time feedback.\n4.  **Language Exchange Community:** Connects users with other learners and native speakers.",
    default:
      "Hello! I am Lumen, your AI assistant. How can I assist you with your project today?",
  };
  const response = responses[content] || responses.default;
  let displayedContent = "";
  let index = 0;
  return new ReadableStream({
    async pull(controller) {
      if (index < response.length) {
        const char = response[index];
        displayedContent += char;
       controller.enqueue(new TextEncoder().encode(char));
        index++;
        await new Promise((resolve) => setTimeout(resolve, 20));
      } else {
        controller.enqueue({ isComplete: true });
        controller.close();
      }
    },
  });
};


export default function ChatPage() {
  const [messages, setMessages] = useState<StaticMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<{
    content: string;
    isComplete: boolean;
    timestamp: string;
  } | null>(null);
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
      setShowScrollToBottom(!isAtBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const startNewChat = () => {
    setMessages([]);
    setStreamingMessage(null);
    setIsTyping(false);
    setSidebarOpen(false);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: StaticMessage = {
      id: Date.now().toString(),
      content,
      is_user: true,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    setStreamingMessage({
      content: "",
      isComplete: false,
      timestamp: new Date().toISOString(),
    });

    let fullResponse = "";


    const reader = mockStreamResponse(content).getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        setStreamingMessage(null);
        setIsTyping(false);
        const aiMessage: StaticMessage = {
          id: (Date.now() + 1).toString(),
          content: fullResponse,
          is_user: false,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        break;
      }
      const chunk = decoder.decode(value); 
      fullResponse += chunk;
      setStreamingMessage((prev) =>
        prev
          ? { ...prev, content: prev.content + chunk }
          : {
              content: chunk,
              isComplete: false,
              timestamp: new Date().toISOString(),
            }
      );
    }
  };

  const handleStartChat = (message: string) => sendMessage(message);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div
      className={cn(
        "flex h-screen w-full font-sans text-foreground overflow-hidden",
        theme === "dark"
          ? "bg-gray-950 text-gray-200"
          : "bg-[#F7F9FC] text-gray-800"
      )}>

      <div
        className={cn(
          "flex lg:hidden items-center justify-between p-4 fixed top-0 left-0 w-full z-40 transition-colors duration-300",
          theme === "dark" ? "bg-gray-950/90" : "bg-white/90"
        )}>
        <h2
          className={cn(
            "text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500"
          )}>
          Lumen
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        startNewChat={startNewChat}
        toggleTheme={toggleTheme}
        theme={theme}
      />

      <div className="flex-1 flex flex-col relative pt-16 lg:pt-0 lg:pl-0">
        <div
          className={cn(
            "hidden lg:flex items-center justify-between p-6 border-b z-30 transition-colors duration-300",
            theme === "dark"
              ? "border-gray-700/50 bg-gray-900/50 backdrop-blur-xl"
              : "border-gray-200 bg-white/80 shadow-md backdrop-blur-md"
          )}>
          <div className="flex-1">
            <h2
              className={cn(
                "text-lg font-semibold",
                theme === "dark"
                  ? "text-foreground"
                  : "bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#9333EA]"
              )}>
              Chat with Lumen
            </h2>
            <p
              className={cn(
                "text-sm",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}>
              {messages.length} messages • AI-powered assistant
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto relative">
          {messages.length === 0 && !streamingMessage ? (
            <WelcomeScreen onStartChat={handleStartChat} theme={theme} />
          ) : (
            <div className="py-6 space-y-4 max-w-4xl mx-auto px-4 lg:px-6">
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  content={message.content}
                  isUser={message.is_user}
                  timestamp={message.created_at}
                  theme={theme}
                />
              ))}
              {isTyping && <TypingSkeleton theme={theme} />}
              <div ref={messagesEndRef} />
            </div>
          )}
          {showScrollToBottom && (
            <Button
              size="icon"
              onClick={scrollToBottom}
              className="fixed bottom-24 right-6 z-40 rounded-full shadow-lg">
              <ChevronDown className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Input */}
        <div
          className={cn(
            "border-t p-4 lg:p-6 z-20 transition-colors duration-300",
            theme === "dark"
              ? "border-gray-700/50 bg-gray-900/50 backdrop-blur-xl"
              : "border-gray-200 bg-white/80 backdrop-blur-xl"
          )}>
          <MessageInput
            onSendMessage={sendMessage}
            disabled={isTyping}
            theme={theme}
          />
          <div
            className={cn(
              "text-center text-xs mt-2",
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            )}>
            Lumen can make mistakes. Consider checking important information.
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  startNewChat,
  toggleTheme,
  theme,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  startNewChat: () => void;
  toggleTheme: () => void;
  theme: string;
}) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "flex w-72 flex-col p-4 transition-all duration-300 z-50 fixed lg:static top-0 left-0 h-full",
        theme === "dark"
          ? "bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50"
          : "bg-white border-r border-[#E5E7EB] shadow-lg",
        !sidebarOpen && "hidden lg:flex"
      )}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Lumen
        </h1>
      </div>
      <Button
        onClick={startNewChat}
        className={cn(
          "mb-4 flex items-center gap-2 w-full justify-start rounded-xl px-4 py-2 text-sm transition-colors",
          theme === "dark"
            ? "bg-gray-800 hover:bg-gray-700/50"
            : "bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white hover:from-[#4338CA] hover:to-[#7E22CE]"
        )}>
        <Plus className="w-4 h-4" /> New Chat
      </Button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {mockSessions.map((session) => (
          <Button
            key={session.id}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors",
              theme === "dark"
                ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                : "text-gray-600 hover:bg-[#D1D5DB] hover:text-gray-900"
            )}>
            <MessageSquare className="w-4 h-4" /> {session.title}
          </Button>
        ))}
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 pt-4 mt-auto",
          theme === "dark"
            ? "border-t border-gray-700/50"
            : "border-t border-[#D1D5DB]"
        )}>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-sky-500 text-white font-medium">
              U
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{mockUser.username}</span>
        </div>
        <Button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-2 w-full justify-start rounded-xl px-4 py-2 text-sm transition-colors",
            theme === "dark"
              ? "bg-gray-800 hover:bg-gray-700/50"
              : "bg-[#F3F4F6] hover:bg-[#D1D5DB] text-gray-900"
          )}>
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-yellow-400" />
          ) : (
            <Moon className="w-4 h-4 text-gray-500" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 w-full justify-start rounded-xl px-4 py-2 text-sm transition-colors",
            theme === "dark"
              ? "text-gray-400 hover:bg-gray-800 hover:text-white"
              : "text-gray-600 hover:bg-[#EDE9FE] hover:text-gray-900"
          )}>
          <Settings className="w-4 h-4" /> Settings
        </Button>
      </div>
    </div>
  );
}

function TypingSkeleton({ theme }: { theme: string }) {
  return (
    <div className="flex gap-3 group">
      <Avatar
        className={cn(
          "w-8 h-8 shrink-0",
          theme === "dark"
            ? "bg-gray-700"
            : "bg-gradient-to-br from-indigo-500 to-pink-500"
        )}>
        <AvatarFallback
          className={cn(
            "text-white",
            theme === "light" ? "text-white" : "text-white"
          )}>
          <Sparkles className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "rounded-2xl rounded-bl-none px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-lg transition-all duration-300",
          theme === "dark"
            ? "bg-gray-800 text-gray-200"
            : "bg-gradient-to-r from-sky-100 to-sky-200 text-gray-900"
        )}>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse delay-0"></div>
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse delay-75"></div>
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  content,
  isUser,
  timestamp,
  theme,
}: {
  content: string;
  isUser: boolean;
  timestamp: string;
  theme: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = content;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
    document.body.removeChild(tempTextarea);
  };

  const bubbleClasses = cn(
    "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-lg transition-all duration-300 animate-fade-in group-hover:block relative",
    isUser
      ? cn(
          "rounded-br-none",
          theme === "dark"
            ? "bg-indigo-600 text-white"
            : "bg-[#2563EB] text-white"
        )
      : cn(
          "rounded-bl-none",
          theme === "dark"
            ? "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 shadow-xl shadow-black/20"
            : "bg-gradient-to-r from-sky-100 to-sky-200 text-gray-900"
        )
  );

  const timestampClasses = cn(
    "absolute -bottom-5 right-0 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
    !isUser && "left-0 right-auto"
  );

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isUser ? "flex-row-reverse" : "flex-row items-start"
      )}>
      <Avatar
        className={cn(
          "w-8 h-8 shrink-0",
          isUser
            ? "bg-indigo-500"
            : cn(
                theme === "dark"
                  ? "bg-gray-700"
                  : "bg-gradient-to-br from-indigo-500 to-pink-500"
              )
        )}>
        <AvatarFallback
          className={cn(
            "text-white",
            theme === "light" ? "text-white" : "text-white"
          )}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}>
        <div className={bubbleClasses}>
          <div className="prose dark:prose-invert prose-sm">
            <ReactMarkdown
              components={{
                code: ({ node, ...props }) => (
                  <code
                    className="bg-gray-200 dark:bg-gray-700 rounded-md px-1 py-0.5 text-sm"
                    {...props}
                  />
                ),
                pre: ({ node, ...props }) => (
                  <pre
                    className="p-2 my-2 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-x-auto text-sm"
                    {...props}
                  />
                ),
              }}>
              {content}
            </ReactMarkdown>
          </div>

          {!isUser && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "ml-2 p-1 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                theme === "dark"
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
              )}
              onClick={handleCopy}>
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
        <span className={timestampClasses}>
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function WelcomeScreen({
  onStartChat,
  theme,
}: {
  onStartChat: (msg: string) => void;
  theme: string;
}) {
  const suggestions = [
    {
      title: "Quick Start",
      description: "Write professional emails",
      prompt: "Write a professional email about project deadline.",
    },
    {
      title: "Problem Solving",
      description: "Debug my code",
      prompt: "Help me fix a React rendering bug.",
    },
    {
      title: "Learning",
      description: "Explain complex concepts",
      prompt: "Explain machine learning in simple terms.",
    },
    {
      title: "Creative",
      description: "Brainstorm ideas",
      prompt: "Suggest features for a language learning app.",
    },
  ];
  return (
    <div className="flex flex-col items-center gap-8 py-20 px-4 text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Lumen
        </h2>
      </div>
      <p
        className={cn(
          "max-w-2xl mx-auto text-lg leading-relaxed",
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        )}>
        Your intelligent AI assistant, designed to help you with coding,
        writing, problem-solving, and creative tasks.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl mt-8">
        {suggestions.map((s, i) => (
          <Card
            key={i}
            className={cn(
              "group cursor-pointer rounded-2xl border-none transition-all duration-300 transform hover:-translate-y-1",
              theme === "dark"
                ? "bg-gray-800/50 border border-gray-700/50 hover:border-indigo-500/50 hover:shadow-xl"
                : "bg-gradient-to-br from-indigo-50 to-pink-50 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
            )}
            onClick={() => onStartChat(s.prompt)}>
            <CardContent className="p-6 text-left">
              <h3
                className={cn(
                  "text-xl font-semibold mb-1 transition-colors",
                  theme === "dark"
                    ? "group-hover:text-indigo-400"
                    : "text-gray-900"
                )}>
                {s.title}
              </h3>
              <p
                className={cn(
                  "transition-colors",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}>
                {s.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MessageInput({
  onSendMessage,
  disabled,
  theme,
}: {
  onSendMessage: (msg: string) => void;
  disabled: boolean;
  theme: string;
}) {
  const [input, setInput] = useState("");
  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-3xl mx-auto rounded-3xl shadow-xl transition-all duration-300",
        theme === "dark"
          ? "bg-gray-800 border border-gray-700"
          : "bg-white/80 border border-[#D1D5DB]"
      )}>
      <Textarea
        placeholder="Message Lumen..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={cn(
          "w-full py-3 px-6 text-sm bg-transparent resize-none border-none focus:outline-none focus:ring-0 rounded-3xl",
          theme === "dark"
            ? "text-gray-200 placeholder-gray-500"
            : "text-[#111827] placeholder-gray-400"
        )}
        rows={1}
        disabled={disabled}
        onKeyDown={(e) =>
          e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
        }
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className={cn(
          "h-10 w-10 shrink-0 mr-2 rounded-full transition-colors p-2",
          theme === "dark"
            ? "bg-indigo-500 hover:bg-indigo-600"
            : "bg-gradient-to-r from-[#4F46E5] to-[#9333EA] hover:from-[#4338CA] hover:to-[#7E22CE]"
        )}
        size="icon">
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
