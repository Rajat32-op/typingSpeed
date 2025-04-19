import { useState } from 'react'
import './App.css'

function App() {
  const [sen,setSen]=useState("Press start button")
  const [showbutton,setShowbutton]=useState(true)

  const fetchQuote = async () => {
    try {
      console.log("hello")
      setSen("Loading please wait")
      const res = await fetch('https://dummyjson.com/quotes/random');
      const data = await res.json();
      setSen(data.quote)
    } catch (err) {
      console.error('Error fetching quote:', err);
      setSen("Error generating sentence. Please check your internet connection")
    }
  };

  const prevent_ctrl_backspace=(e) => {
    if (e.key === 'Backspace' && e.ctrlKey) {
      e.preventDefault(); 
    }
  }

  const start=async()=>{
    setShowbutton(false)
    fetchQuote()
  }

  const restart=async()=>{
    setShowbutton(true)
    setSen("Press start button")
  }

  
  return (
    <>
    <div id="body" className='h-screen w-screen px-1 py-1'>
      <div id="navbar" className='bg-purple-400 h-[12%] w-full flex justify-center items-center'>
        <p className='text-black font-bold text-5xl '> TYPING SPEED GAME</p>
      </div>
      <div id='display-box' className='bg-blue-600 border-2 h-[30%] w-full my-1'>
        <p className='text-2xl text-white px-2 py-10'>{sen}</p>
      </div>
      <div id='input-box' className='bg-yellow-200 h-[45%] border-4 my-1 flex flex-col justify-center items-center'>
        {showbutton&&<button className='bg-purple-400 rounded-2xl text-3xl h-14 w-24 text-white' onClick={start}>START</button>}
        {!showbutton && <p className='text-2xl text-black py-1'>Start typing here</p>}
        {!showbutton && <input type='text' className='bg-yellow-100 w-[80%] h-18 font-bold font-mono text-3xl border-0' onKeyDown={prevent_ctrl_backspace} autoComplete="off" spellCheck="false" autoCorrect="off"></input>}
      </div>
      <div id='restart_button' className='flex justify-center'>
        {!showbutton && <button className='bg-purple-400 rounded-2xl text-3xl h-14 w-30 text-white' onClick={restart}>RESTART</button>}
      </div>
      </div>
    </>
  )
}

export default App
