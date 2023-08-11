import { Inter } from 'next/font/google'
import { useEffect, useState } from "react"
import Loading from "../components/Loading"
import useSound from 'use-sound'
import axios from 'axios'
import useUser from '../../useUser'
import Button from '@/components/Button'
import { useRouter } from 'next/navigation'
import supabase from '../../supabase'
import { toast } from 'react-hot-toast'
import HistoryItem from '@/components/HistoryItem'

const { Configuration, OpenAIApi } = require("openai")

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { user } = useUser()
  const router = useRouter()

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })

  const loadingSFx = './loading-bgm.mp3'

  const [currentSound, setCurrentSound] = useState(null)
  const [audio, setAudio] = useState(null)

  const [play, { stop }] = useSound(loadingSFx,{interrupt: true, loop: true})

  const openai = new OpenAIApi(configuration)
  
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bgUrl, setBgUrl] = useState(null)

  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])

  const constructPrompt = () => {
    return `You are an intelligent and helpful assistant that knows anime and manga stories well. Suggest a motivational message or quote from the anime character of only Naruto Uzumaki or Gaara from Naruto Shippuden for each of my problems. Follow the format provided to respond based on my input. Remember to have the message no longer than 100 words and do not mention the speaker's name in the quote. My problem is: ${prompt}. Do not include any other than the mentioned json format and render output in JSON parsable format.
            Answer Format:
            {
              "quote": "suggested message or quote here",
              "character": "mention anime character from which message has been generated without anime series title"
            }`
  }

  async function fetchPublicUrl(id) {
    return new Promise((resolve, reject) => {
      const data = supabase.storage.from('tts').getPublicUrl(id + '.mp3')
      if (data) {
        resolve(data)
      } else {
        reject('Error Getting Public URL!')
      }
    })
  }

  const handleSubmit = async () => {

    if (!user) return toast.error('Authentication Failed!')
    if (!prompt) return toast.error('Invalid problem!')

    setLoading(true)
    play()
    try {

      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: constructPrompt(),
        temperature: 0.7,
        max_tokens: 300,
      })
      
      let temp_response = JSON.parse(result.data.choices[0].text.replace('Answer:','').replace(/\n/g,''))
      setResponse(temp_response)

      const _result = await axios.post(temp_response?.character==='Gaara'?'/api/play-ht-tts-1':'/api/play-ht-tts',{content:temp_response?.quote})

      stop()
      setCurrentSound(_result?.data?.url)
      setLoading(false)

      // saving audio to storage
      const _audio_url = _result?.data?.url
    
        const blob = await fetch(_audio_url).then(url => url.blob())
        await supabase.storage.from('tts').upload(_result?.data?.id+'.mp3', blob)
        
        const data = await fetchPublicUrl(_result?.data?.id)

        // get the gif
        const gifData = await axios.post('/api/get-me-gif',{ q: temp_response?.character==='Gaara'?'Gaara from Naruto':'Naruto Uzumaki' })

        let tempGifs = [temp_response?.character==='Gaara'?'./gaara.gif':'./bg.webp']
        if (gifData?.data?.url) {
          tempGifs.push(gifData?.data?.url)
          setBgUrl(gifData?.data?.url)
        } 

        let bgURL = tempGifs[Math.floor(Math.random() * tempGifs.length)]

        // saving history to db
        const { error, data: savedHistory } = await supabase.from('messages').insert({ t_id: _result?.data?.id, user_id: user?.id, quote: temp_response?.quote, character: temp_response?.character, bg_url: bgURL, audio_url: data?.data?.publicUrl, user_problem: prompt })

        if (error) {
          console.log(error?.message||"History not saved");
        }

    } catch(e) {
      console.log(e);
      stop()
    } finally {
      setPrompt('')
    }
  }

  async function fetchHistory() {
    const { error, data } = await supabase.from('messages').select('*').eq('user_id', user?.id)
    if (error) {
      toast.error('Failed Fetching history!')
      return
    } 
    setHistory(data)
  }

  useEffect(() => {
    if (user){
      fetchHistory()
    }
  },[user])

  const loadData = (data) => {
    
    setShowHistory(false)

    setLoading(true)
    play()

    // setting necessary data
    setResponse(data?.quote)
    setCurrentSound(data?.audio_url)
    setBgUrl(data?.bg_url)

    setTimeout(() => {
      stop()
      setLoading(false)
    }, 5000)

  }

  function clearAndReset() {
    setResponse(null)
    setPrompt('')
    setCurrentSound(null)
    setBgUrl(null)
    fetchHistory()
  }

  return (
    <div className="w-full min-h-screen bg-black bg-cover flex flex-col items-center relative justify-center" style={{ backgroundImage: `${(response&&!loading)?`url(${response.character==='Gaara'?bgUrl||'./gaara.gif':bgUrl||'./bg.webp'})`:''}`, boxShadow: "0px 4px 4px 0px #00000040,inset 0 0 0 1000px rgba(0,0,0,.6)" }}>
      {
        user ? (
          <div className='w-full bg-black text-right flex flex-col lg:flex-row lg:mt-0 mt-4 items-center justify-between top-0 absolute pr-4'>
            <p onClick={() => router.push('/')} className='cursor-pointer text-slate-200 font-bold px-4 text-md'><span className='w-5 mx-3 h-2 bg-orange-500 rounded-sm px-2'></span>Talk-No Justu Tool</p>
              <div className='w-auto flex items-center'>
                <p className='flex items-center text-center text-white text-md py-4 px-2'>
                  <span className='text-slate-500 text-sm px-2 mt-1'>built for</span>
                  <img src='./supabase-dark.svg' className='object-contain w-24 mt-1 mr-2' />
                  <span className='font-light mx-2 text-slate-600'>|</span>{user?.user_metadata?.full_name}
                </p>
                <p onClick={async () => {
                  await supabase.auth.signOut()
                  router.refresh()
                }} className='font-medium px-3 mx-1 rounded-md py-1 text-white bg-orange-600 text-sm cursor-pointer'>Log Out</p>
              </div>
          </div>
        ) : (
          <div className='w-full py-4 absolute top-0 bg-black text-right flex items-center z-20'>
              <p onClick={() => router.push('/')} className='cursor-pointer text-slate-200 font-bold px-4 text-md'><span className='w-5 mx-3 h-2 bg-orange-500 rounded-sm px-2'></span>Talk-No Justu Tool</p>
          </div>
        )
      }
      {
        loading ? (<Loading />)
        : response ? (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="w-full lg:w-1/3 mx-auto bg-black rounded-md shadow-xl p-4 text-white font-bold text-center flex flex-col items-center text-lg">
              <p>{response?.quote||response}</p>
              <audio ref={e=>setAudio(e)} preload='auto'>
                <source type="audio/mp3" src={currentSound}></source>
              </audio>
              <div className="w-full flex items-center justify-center mt-3">
                <button onClick={() => {
                  audio?.play()
                }}
                  className="disabled:bg-orange-300 mr-3 disabled:cursor-not-allowed hover:bg-orange-700 w-auto px-2 py-2 font-medium text-white bg-orange-500 rounded-sm mx-2 text-sm"
                >
                  Play
                </button>
                <button
                  onClick={() => {
                    clearAndReset()
                  }}
                  className="disabled:bg-orange-300 disabled:cursor-not-allowed hover:bg-orange-700 w-auto px-2 py-2 font-medium text-white bg-orange-500 rounded-sm mx-2 text-sm"
                >
                  Try Again!
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='w-full flex flex-col items-center justify-center relative'>
            <img 
              alt='Naruto Uzumaki'
              src='./naruto-dance.gif'
              className='object-contain h-56 mb-6'
            />
            {
              user && (
                <div className='w-[90%] lg:w-[25%] absolute -bottom-32 bg-black lg:top-0 lg:right-10'>
                  <div onClick={() => setShowHistory(!showHistory)} className='w-full rounded-md p-2 cursor-pointer border-gray-600 border flex items-center'>
                    <h1 className='flex items-center text-sm text-white cursor-pointer'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 mr-2 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      {showHistory?'Hide':'Show'} History ({history?.length})
                    </h1>
                  </div>
                  {
                    showHistory && (
                      <div className='border-gray-600 border rounded-md my-2 flex flex-col items-center'>
                        {history?.length===0&&(<p className='w-full text-slate-400 text-center text-sm py-1'>No History Found</p>)}
                        {
                          history?.map(item => (
                            <HistoryItem item={item} key={item.id} onClick={(e) => loadData(e)} />
                          ))
                        }

                      </div>
                    )
                  }
                </div>
              )
            }
            {
              user ? (
                <div className="w-full flex items-center justify-center">
                  <input
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    type='text'
                    placeholder='Mention your problem here'
                    className='outline-none focus:outline-orange-500 ring-orange-400 focus:ring-orange-400 w-[60%] lg:w-[35%] bg-white px-4 py-3 text-sm rounded-md border shadow-md text-black'
                  />
                  <button
                    onClick={() => handleSubmit()}
                    disabled={loading||!prompt}
                    className="disabled:cursor-not-allowed hover:bg-orange-700 w-auto px-4 py-3 font-medium text-white bg-orange-500 rounded-md mx-2 text-sm"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div className="w-[25%] flex items-center justify-center">
                  <Button
                    onClick={() => router.push('/login')}
                    type='small'
                    label='Log in'
                  />
                  <Button
                    onClick={() => router.push('/signup')}
                    type='small'
                    label='Create Account'
                  />
                </div>
              )
            }
          </div>
        )
      }
      <p onClick={() => router.push('/howitworks')} className='w-auto text-orange-500 hover:text-orange-700 cursor-pointer text-sm py-4 hover:underline text-center'>See How It Works</p>

    </div>
  )
}
