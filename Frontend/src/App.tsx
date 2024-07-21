import './App.css'
import { io } from 'socket.io-client'

function App() {

  const socket = io('http://localhost:3000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = (document.getElementById('message') as HTMLInputElement).value;
    if (message) {
      socket.emit('message', message);
      (document.getElementById('message') as HTMLInputElement).value = '';
      console.log('Message sent:', message);
    }
  }

  return (
    <>
      <div className='m-auto w-96 h-dvh border-2 rounded-2xl border-white flex flex-col'>
        <form onSubmit={handleSubmit} className='flex flex-col justify-between h-full'>
          <div className='flex justify-between mt-auto'>
            <input type="text" name='message' id='message' placeholder='Type a message' autoComplete='off' className='flex-1 mr-2 p-2 border border-gray-300 rounded'/>
            <button type='submit' className='w-20 bg-blue-500 text-white p-2 rounded'>Send</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default App
