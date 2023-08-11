import Button from '@/components/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast,{Toaster} from 'react-hot-toast'
import supabase from '../../supabase'

function Login() {

    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    async function logIn() {
        if (!email || !password) {
            setError(true)
            return
        }

        try {
            setLoading(true)

            const { data, error } = await supabase.auth.signInWithPassword({ email, password })

            if (error) {
                toast.error(error?.message)
            } else {
                toast.success('Authenticated with supabase')
                setTimeout(() => router.push('/'), 2000)
            }

        } catch(err) {  
            console.log(err);
            toast.error('Internal Server Error')
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='w-full h-screen bg-black flex flex-row items-center justify-center relative'>
        <div className='w-full py-4 absolute top-0 bg-black text-right flex items-center'>
              <p onClick={() => router.push('/')} className='cursor-pointer text-slate-200 font-bold px-4 text-md'><span className='w-5 mx-3 h-2 bg-orange-500 rounded-sm px-2'></span>Talk-No Justu Tool</p>
          </div>
        <img onClick={() => router.push('/')} src='./login-n.gif' className='cursor-pointer object-contain h-56' />
        <div className='w-[25%] flex items-center flex-col justify-center ml-6'>
            <input
                onFocus={() => setError(false)}
                value={email}
                onChange={e => setEmail(e.target.value)}
                type='email'
                placeholder='Email Address'
                className='outline-none mb-2 focus:outline-orange-500 ring-orange-400 focus:ring-orange-400 w-full bg-white px-4 py-3 text-sm rounded-md border shadow-md text-black'
            />
            {!email&&error&&(<span className='w-full text-red-500 py-1 mb-2 text-xs'>Invalid Email Address</span>)}
            <input
                onFocus={() => setError(false)}
                value={password}
                onChange={e => setPassword(e.target.value)}
                type='password'
                placeholder='Password'
                className='outline-none mb-2 focus:outline-orange-500 ring-orange-400 focus:ring-orange-400 w-full bg-white px-4 py-3 text-sm rounded-md border shadow-md text-black'
            />
            {!password&&error&&(<span className='w-full text-red-500 py-1 text-xs'>Invalid Password</span>)}
            <Button 
                loading={loading}
                onClick={() => logIn()}
                label='Log in'
                className='w-full bg-orange-600 mt-2 text-white rounded-md py-3 px-4 text-md font-medium disabled:cursor-not-allowed hover:bg-orange-700 disabled:bg-orange-300'/>
            <Toaster position='top-center' />
            <p className='w-full text-slate-400 text-center py-3 text-sm'>Don't have an account? <Link href="/signup"><span className='underline hover:text-orange-500 text-orange-600'>Create One</span></Link></p>
        </div>
    </div>
  )
}

export default Login