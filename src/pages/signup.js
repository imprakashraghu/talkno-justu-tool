import Button from '@/components/Button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Link from 'next/link'
import toast,{Toaster} from 'react-hot-toast'
import supabase from '../../supabase'

function SignUp() {

    const router = useRouter()

    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    async function createAccount() {
        if (!email || !fullName || !password) {
            setError(true)
            return
        }

        try {

        setLoading(true)

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    email: email,
                }
            },
        })

        if (error) {
            // toast.error(error)
            if (error?.message == 'duplicate key value violates unique constraint "profiles_email_address_key"') {
                toast.error('Email Address already exists!')
                return
            }
            console.log(error);
        } else {
            toast.success('Authenticated with Supabase')
            setTimeout(() => router.push('/'), 2000)
        }

        } catch(err) {
        
        // toast.error(err||'Internal Server Error')
        console.log(err);

        } finally {
        setLoading(false)
        }
    }

  return (
    <div className='w-full h-screen bg-black flex flex-row items-center justify-center relative'>
        <div className='w-full py-4 absolute top-0 bg-black text-right flex items-center'>
            <p onClick={() => router.push('/')} className='cursor-pointer text-slate-200 font-bold px-4 text-md'><span className='w-5 mx-3 h-2 bg-orange-500 rounded-sm px-2'></span>Talk-No Justu Tool</p>
        </div>
        <img onClick={() => router.push('/')} src='./create-n.gif' className='cursor-pointer object-contain h-56' />
        <div className='w-[25%] flex flex-col items-center justify-center ml-6'>
            <div className='w-full mx-auto flex flex-col items-center'>
                <input
                    onFocus={() => setError(false)}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    type='text'
                    placeholder='Full Name'
                    className='outline-none mb-2 focus:outline-orange-500 ring-orange-400 focus:ring-orange-400 w-full bg-white px-4 py-3 text-sm rounded-md border shadow-md text-black'
                />
                {!fullName&&error&&(<span className='w-full text-red-500 mb-2 py-1 text-xs'>Invalid Full Name</span>)}
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
                    onClick={() => createAccount()}
                    label='Create Account'
                    className='w-full bg-orange-600 mt-2 text-white rounded-md py-3 px-4 text-md font-medium disabled:cursor-not-allowed hover:bg-orange-700 disabled:bg-orange-300'/>
            </div>
            <Toaster position='top-center' />
            <p className='w-full text-slate-400 text-center py-3 text-sm'>Already have an account? <Link href="/login"><span className='underline hover:text-orange-500 text-orange-600'>Log in</span></Link></p>
        </div>
    </div>
  )
}

export default SignUp