import { useState ,useEffect,useRef} from 'react'
import './App.css'

function App() {
  const [sen,setSen]=useState("Press start button")
  const [showbutton,setShowbutton]=useState(true)
  const [status,setStatus]=useState(new Array(sen.length).fill('wait'))
  const [nextSen,setNextSen]=useState("")
  const [started,setStarted]=useState(false);
  const [time,setTime]=useState(6)
  const [timeover,setTimeover]=useState(false);
  const [inp,setInp]=useState("");
  const correct=useRef(0);
  const wrong=useRef(0);
  const wpm=useRef(0);
  const scrollRef=useRef(null)

  useEffect(()=>{
    if(scrollRef.current){
      scrollRef.current.scrollTop=scrollRef.current.scrollHeight;
    }
  },[sen]);

  useEffect(()=>{
    if(started){
      if(time<0){
      setTimeover(true);
      wpm.current=parseInt(correct.current/5);
     console.log(wpm.current);
        return;
      }
      const inter=setInterval(()=>{
        setTime(time-1);
      },1000);
      return ()=> clearInterval(inter);
    }
  },[time,started])

  const fetchQuote = async () => {
      try {
        console.log("hello")
        setSen("Loading please wait")
        const res = await fetch('https://dummyjson.com/quotes/random');
        const data = await res.json();
        setSen(data.quote)
        const res2=await fetch('https://dummyjson.com/quotes/random')
        const data2= await res2.json();
        setNextSen(data2.quote)
      } catch (err) {
        console.error('Error fetching quote:', err);
        setSen("Error generating sentence. Please check your internet connection")
      }
    
  };

  const prevent_ctrl_backspace=(e) => {
    if (e.key === 'Backspace' && e.ctrlKey) {
      e.preventDefault(); 
    }
    if(e.key==='v' && e.ctrlKey){
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
    const newstatus=new Array(18).fill('wait');
    setStatus(newstatus);
    setStarted(false)
    setTime(60);
    setTimeover(false);
  }

  const getNextSen=async()=>{
      setSen(sen+nextSen)
      const res=await fetch('https://dummyjson.com/quotes/random')
      const data= await res.json();
      setNextSen(data.quote)
      const newstatus=new Array(nextSen.length).fill('wait');
      setStatus(status.concat(newstatus));
  }
  const validate=(e)=>{
    const newInp=e.target.value;
    setInp(newInp);
    if(newInp!="")setStarted(true);
    console.log(sen.length,newInp.length);
    if(sen.length<=newInp.length){
      getNextSen()
      console.log(sen);
    }
      let newCor=0;
      let newWrong=0;
      const newstatus=sen.split('').map((ch,i)=>{
        if(i<newInp.length){
          if(ch===newInp[i]){
            newCor++;
            return 'correct';
          }
          else{
            newWrong++;
            return 'wrong';
          }
        }
        else return 'wait'
      })
      correct.current=newCor;
      wrong.current=newWrong;
      setStatus(newstatus);
  }
  
  return (
    <>
    <div id="body" className='h-screen w-screen px-1 py-1'>
      <div id="navbar" className='bg-purple-400 h-[12%] w-full flex justify-center items-center'>
        <p className='text-black font-bold text-5xl '> TYPING SPEED GAME</p>
      </div>
      <div id='display-box' ref={scrollRef} className='bg-blue-600 px-2 border-2 overflow-y-scroll flex flex-wrap h-[30%] w-full my-1'>
        {
        sen.split('').map((ch,i)=>{
          return(<span key={`${ch}-${status[i]}-${i}`}style={{display: 'inline-block',animation: status[i] === 'correct' ? 'pop 0.2s ease-out' : 'none',}} className={`text-2xl ${status[i]==='correct'?'text-green-400 ':(status[i]==='wrong'?'text-red-400':'text-white')}`}>{ch === ' ' ? '\u00A0' :ch}</span>);
        })}
      </div>
      <div id='input-box' className='bg-yellow-200 h-[45%] border-4 my-1 flex flex-col justify-center items-center'>
        {showbutton&&<button className='bg-green-500 rounded-2xl text-3xl h-14 w-24 font-bold text-white' onClick={start}>START</button>}
        {!showbutton && (<div className='flex w-full'>
          <p className='text-3xl px-5 pb-5'>Time Remaining</p>
          <div className='bg-gray-400 ml-auto rounded-2xl w-[50%] h-5 flex'>
          <div className='ml-auto transition-all rounded-2xl duration-100 text-3xl h-5 bg-green-600' style={{ width: `${(time / 60) * 100}%` }}></div>
        </div>
        </div>)
        }
        {!showbutton && <input type='text' placeholder='Start Typing here' className='bg-yellow-100 w-[80%] h-18 font-bold font-mono text-3xl border-0' disabled={timeover} onChange={validate} onKeyDown={prevent_ctrl_backspace} autoComplete="off" spellCheck="false" autoCorrect="off"></input>}
      </div>
      <div id='restart_button' className='flex justify-center'>
        {!showbutton && <button className='bg-green-500 font-bold rounded-2xl text-3xl h-14 w-34 text-white' onClick={restart}>RESTART</button>}
      </div>
      </div>
    </>
  )
}

export default App
