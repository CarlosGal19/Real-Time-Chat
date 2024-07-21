import { useEffect } from 'react';
import './App.css';
import { io } from 'socket.io-client';

function App() {
  // Create the socket connection outside useEffect to avoid creating multiple connections
  const socket = io('http://localhost:3000');

  useEffect(() => {
    // Handle incoming messages from the server
    const handleServerMessage = (message: string) => {
      const ul = document.getElementById('messages') as HTMLUListElement;
      const li = document.createElement('li');
      li.textContent = message;
      li.classList.add('text-red-500');
      ul.appendChild(li);
    };

    socket.on('server-message', handleServerMessage);

    // Cleanup the effect to avoid memory leaks
    return () => {
      socket.off('server-message', handleServerMessage);
    };
  }, [socket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = (document.getElementById('message') as HTMLInputElement).value;
    if (message) {
      socket.emit('client-message', message);
      const ul = document.getElementById('messages') as HTMLUListElement;
      const li = document.createElement('li');
      li.textContent = message;
      li.classList.add('text-blue-500');
      ul.appendChild(li);
      (document.getElementById('message') as HTMLInputElement).value = '';
      console.log('Message sent:', message);
    }
  };

  return (
    <>
      <div className='m-auto w-96 h-dvh border-2 rounded-2xl border-white flex flex-col'>
        <div className='flex-1 p-2 border-b-2 border-white'>
          <h2 className='text-white'>Welcome to the chat!</h2>
        </div>
        <ul id='messages' className='h-full overflow-y-auto'>
          {/* Messages will be appended here */}
        </ul>
        <form onSubmit={handleSubmit} className='flex flex-col justify-between h-full'>
          <div className='flex justify-between mt-auto'>
            <input type="text" name='message' id='message' placeholder='Type a message' autoComplete='off' className='flex-1 mr-2 p-2 border border-gray-300 rounded'/>
            <button type='submit' className='w-20 bg-blue-500 text-white p-2 rounded'>Send</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
