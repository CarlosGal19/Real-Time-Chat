import { useEffect, useState } from 'react';
import './App.css';
import { io, Socket } from 'socket.io-client';

interface Auth {
  serverOffset: number;
}

interface Message {
  text: string;
  fromServer: boolean;
}

const socket: Socket = io('http://localhost:3000', {
  auth: {
    serverOffset: 0,
  } as Auth,
});

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const handleServerMessage = (message: string, serverOffset: number) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, fromServer: true },
      ]);
      (socket.auth as Auth).serverOffset = serverOffset;
    };

    socket.on('server-message', handleServerMessage);

    return () => {
      socket.off('server-message', handleServerMessage);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message) {
      socket.emit('client-message', message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, fromServer: false },
      ]);
      setMessage('');
      console.log('Message sent:', message);
    }
  };

  return (
    <div className="m-auto w-96 h-dvh border-2 rounded-2xl border-white flex flex-col">
      <div className="flex-1 p-2 border-b-2 border-white">
        <h2 className="text-white">Welcome to the chat!</h2>
      </div>
      <ul id="messages" className="h-full overflow-y-auto">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={msg.fromServer ? 'text-red-500' : 'text-blue-500'}
          >
            {msg.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
        <div className="flex justify-between mt-auto">
          <input
            type="text"
            name="message"
            id="message"
            placeholder="Type a message"
            autoComplete="off"
            className="flex-1 mr-2 p-2 border border-gray-300 rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="w-20 bg-blue-500 text-white p-2 rounded">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
