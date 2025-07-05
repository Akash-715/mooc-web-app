import React, { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm CourseBot 🤎. What would you like to learn today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateReply(input);
      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateReply = (text) => {
    const query = text.toLowerCase();

    if (query.includes("bye") || query.includes("goodbye") || query.includes("see you"))
      return "Goodbye! May your learning be as strong as espresso ☕😊";

    if (query.includes("thank") || query.includes("tq") || query.includes("thanks"))
      return "You're most welcome! Happy to help anytime ☕💛";

    if (query.includes("welcome"))
      return "Thank you! I'm always here to serve fresh learning ☕🤎";

    if (
      query.includes("great job") ||
      query.includes("good job") ||
      query.includes("awesome") ||
      query.includes("nice") ||
      query.includes("cool")
    )
      return "Aww, thanks! You're the cream in my coffee ☕😄";

    if (query.includes("ai") || query.includes("artificial intelligence"))
      return "AI is brewing hot right now! Try 'AI For Everyone' on Coursera ☕🤖";
    if (query.includes("cyber") || query.includes("security"))
      return "For Cybersecurity, I recommend 'Cyber Safe Essentials' on Udemy 🔐";
    if (query.includes("web") || query.includes("html") || query.includes("css"))
      return "Let’s craft the web! Check out 'HTML/CSS Bootcamp' on Springboard 🌐";
    if (query.includes("javascript") || query.includes("js"))
      return "JavaScript is a must-have! Try 'Modern JS from Scratch' ☕📜";
    if (query.includes("react"))
      return "'React for Beginners' on Coursera will jumpstart your journey 🚀";
    if (query.includes("ui") || query.includes("ux") || query.includes("design"))
      return "Design dreams start with 'Intro to UI/UX' on Infosys Springboard 🎨";
    if (query.includes("python"))
      return "Python is smooth like a latte! Try 'Learn Python in 12 Days' 🐍";
    if (query.includes("java"))
      return "Grab a hot Java course! Try 'Java Programming Masterclass' ☕👨‍💻";
    if (query.includes("beginner"))
      return "'Programming Fundamentals' on Coursera is perfect for beginners 👶";
    if (query.includes("advanced"))
      return "'Advanced Programming Concepts' on edX is great for leveling up 💪";
    if (query.includes("platform"))
      return "We pull courses from Coursera, edX, Udemy, and Infosys Springboard 📚";
    if (query.includes("duration"))
      return "Courses can be short like an espresso shot (2 hrs) or a full brew (6 weeks) ⏳";
    if (query.includes("difficulty"))
      return "Courses range from Beginner ☕ to Advanced ☕☕☕—you choose the roast!";
    if (query.includes("quiz"))
      return "Take our 3-level quiz to get freshly brewed course picks just for you 🎯";
    if (query.includes("recommendation"))
      return "Try our quiz or explore trending topics for curated course recos 💡";
    if (query.includes("save") || query.includes("bookmark"))
      return "Click the ❤ icon or 'Save for Later' to bookmark your favorites 📌";
    if (query.includes("dashboard"))
      return "Your Dashboard is like your coffee tray—everything you need in one place ☕📋";
    if (query.includes("help") || query.includes("how to"))
      return "Need help? Ask me about platforms, quizzes, topics, or how to start! 🧠";
    if (query.includes("course") && query.includes("free"))
      return "Many courses are free! Try Infosys Springboard and some Udemy options 🆓";
    if (query.includes("data science"))
      return "Data Science? 'IBM Data Science Professional Cert' on Coursera is awesome 📊";
    if (query.includes("machine learning"))
      return "'Intro to Machine Learning' by Andrew Ng is a fan favorite 🤖📈";
    if (query.includes("cloud"))
      return "For cloud skills, try 'AWS Fundamentals' on edX ☁🧠";

    const fallbacks = [
      "Hmm, I'm not sure I understood that. Try asking about Python, AI, or Web Dev 😊",
      "Could you rephrase that? I'm learning new things every day too! 📚",
      "Try the Quiz section to discover your perfect course match 🎯",
      "That's interesting! Use keywords like 'AI', 'Java', or 'Design' to get started 🔍",
      "You might be looking for something on Coursera, edX, or Springboard ☕",
      "Brew another question! I’m here to help ☕💬",
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const styles = {
    container: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 9999,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    toggleButton: {
      backgroundColor: "#6f4e37",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: "55px",
      height: "55px",
      fontSize: "22px",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
    chatWindow: {
      width: "300px",
      backgroundColor: "#f8f1e7",
      borderRadius: "15px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      animation: "slideUp 0.3s ease-in-out",
    },
    chatHeader: {
      backgroundColor: "#a9746e",
      color: "#fff",
      padding: "10px 15px",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    chatBody: {
      padding: "10px",
      height: "250px",
      overflowY: "auto",
      backgroundColor: "#fdf7f2",
      display: "flex",
      flexDirection: "column",
    },
    chatMsg: {
      marginBottom: "10px",
      padding: "8px 12px",
      borderRadius: "12px",
      maxWidth: "80%",
      lineHeight: "1.4",
      fontSize: "14px",
    },
    bot: {
      backgroundColor: "#d7ccc8",
      alignSelf: "flex-start",
      color: "#3e2723",
    },
    user: {
      backgroundColor: "#bcaaa4",
      alignSelf: "flex-end",
      color: "#212121",
    },
    chatInput: {
      display: "flex",
      padding: "10px",
      backgroundColor: "#eee1d5",
      borderTop: "1px solid #d3c2b3",
    },
    inputBox: {
      flex: 1,
      padding: "8px 10px",
      borderRadius: "8px",
      border: "1px solid #c2b2a3",
      outline: "none",
      fontSize: "14px",
      backgroundColor: "#fffaf5",
    },
    sendButton: {
      marginLeft: "8px",
      padding: "8px 10px",
      backgroundColor: "#6f4e37",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      {open && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            CourseBot 🤎
            <button onClick={() => setOpen(false)} style={{ background: "transparent", color: "#fff", border: "none", fontSize: "16px", cursor: "pointer" }}>✖</button>
          </div>
          <div style={styles.chatBody}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.chatMsg,
                  ...(msg.sender === "bot" ? styles.bot : styles.user),
                }}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ ...styles.chatMsg, ...styles.bot }}>
                <i>Typing a fresh reply... ☕</i>
              </div>
            )}
          </div>
          <div style={styles.chatInput}>
            <input
              type="text"
              value={input}
              placeholder="Ask me anything about courses, skills, or tech..."
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.inputBox}
            />
            <button onClick={handleSend} style={styles.sendButton}>➤</button>
          </div>
        </div>
      )}

      <button style={styles.toggleButton} onClick={() => setOpen(!open)}>
        💬
      </button>
    </div>
  );
}
