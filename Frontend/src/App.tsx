import './App.css'

function App() {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = (document.getElementById('message') as HTMLInputElement).value
    console.log(message)
  }

  return (
    <>
      <div className='m-auto w-96 h-dvh border-2 border-white relative overflow-hidden'>
        <form onSubmit={handleSubmit}>
          <div className='flex justify-evenly'>
            <input type="text"  name='message' id='message' placeholder='Type a message' autoComplete='off'/>
            <button type='submit' className='w-20 bg-blue-500 text-white'>Send</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default App
