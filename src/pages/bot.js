import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import parts from '../trainingData';

const ChatbotPage = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyA1_I9VGMPkjWR4G7M2-16woVwN-hJw5U0");
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 0.55,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 9000,
    responseMimeType: "text/plain",
  };

  const runModel = async (input) => {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [...parts, {text: `input: ${input}`}] }],
      generationConfig,
    });
    return result.response.text();
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const response = await runModel(input);

      setChatHistory([
        ...chatHistory,
        { type: 'user', message: input },
        { type: 'bot', message: response },
      ]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setChatHistory([]);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Yole Test Chatbot</h1>

      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ height: '300px', overflowY: 'auto', marginBottom: '10px', border: '1px solid #eee', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          {chatHistory.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>No messages yet. Start the conversation!</p>
          ) : (
            chatHistory.map((chat, index) => (
              <div key={index} style={{ margin: '10px 0' }}>
                <strong style={{ color: chat.type === 'user' ? '#007BFF' : '#28A745' }}>
                  {chat.type === 'user' ? 'You' : 'Bot'}:
                </strong>
                <div>
                  {chat.type === 'bot' ? (
                    <ReactMarkdown>{chat.message}</ReactMarkdown>
                  ) : (
                    chat.message
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: isLoading || !input.trim() ? '#ccc' : '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>

        <button
          onClick={clearHistory}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF4D4D',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Clear History
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
