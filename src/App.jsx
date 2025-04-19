import { useState } from 'react'
import './App.css'

function App() {
  const [sen,setSen]=useState("Press start button")
  const [showbutton,setShowbutton]=useState(true)
  const [inp,setInp]=useState("")
  const [status,setStatus]=useState(new Array(sen.length).fill('wait'))

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

  const validate=(e)=>{
    setInp(e.target.value)
    const newInp=e.target.value
    const newstatus=sen.split('').map((ch,i)=>{
      if(i<newInp.length){
        return ch===newInp[i]?'correct':'wrong';
      }
      else return 'wait'
    })
    setStatus(newstatus);
  }
  
  return (
    <>
    <div id="body" className='h-screen w-screen px-1 py-1'>
      <div id="navbar" className='bg-purple-400 h-[12%] w-full flex justify-center items-center'>
        <p className='text-black font-bold text-5xl '> TYPING SPEED GAME</p>
      </div>
      <div id='display-box' className='bg-blue-600 px-2 border-2 flex h-[30%] w-full my-1'>
        {
        sen.split('').map((ch,i)=>{
          return(<p key={i} className={`text-2xl py-10 ${status[i]==='correct'?'text-green-400':(status[i]==='wrong'?'text-red-400':'text-white')}`}>{ch === ' ' ? '\u00A0' : ch}</p>);
        })}
      </div>
      <div id='input-box' className='bg-yellow-200 h-[45%] border-4 my-1 flex flex-col justify-center items-center'>
        {showbutton&&<button className='bg-purple-400 rounded-2xl text-3xl h-14 w-24 text-white' onClick={start}>START</button>}
        {!showbutton && <p className='text-2xl text-black py-1'>Start typing here</p>}
        {!showbutton && <input type='text' className='bg-yellow-100 w-[80%] h-18 font-bold font-mono text-3xl border-0' onChange={validate} onKeyDown={prevent_ctrl_backspace} autoComplete="off" spellCheck="false" autoCorrect="off"></input>}
      </div>
      <div id='restart_button' className='flex justify-center'>
        {!showbutton && <button className='bg-purple-400 rounded-2xl text-3xl h-14 w-30 text-white' onClick={restart}>RESTART</button>}
      </div>
      </div>
    </>
  )
}

export default App
