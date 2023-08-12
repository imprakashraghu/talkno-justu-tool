import React from 'react'
import useUser from '../../useUser'
import supabase from '../../supabase'
import { useRouter } from 'next/navigation'

function HowItWorks() {

    const {user} = useUser()
    const router = useRouter()

  return (
    <div className="w-full min-h-screen bg-black bg-cover flex flex-col items-center relative justify-center overflow-y-auto">
        {
            user ? (
                <div className='w-full bg-black text-right flex flex-col lg:flex-row lg:mt-0 mt-4 items-center justify-between top-0 relative pr-4 mb-4'>
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
                        }} className='z-10 font-medium px-3 mx-1 rounded-md py-1 text-white bg-orange-600 text-sm cursor-pointer'>Log Out</p>
                    </div>

                </div>
            ) : (
                <div className='w-full py-4 bg-black text-right flex items-center z-20'>
                    <p onClick={() => router.push('/')} className='cursor-pointer text-slate-200 font-bold px-4 text-md'><span className='w-5 mx-3 h-2 bg-orange-500 rounded-sm px-2'></span>Talk-No Justu Tool</p>
                </div>
            )
        }
        <img
            src='./howitworks.png'
            className='object-contain my-4 lg:px-0 px-4'
            style={{ maxHeight: 500 }}
        />
        <div className='w-full px-4 lg:px-24 py-4 lg:py-10'>
            <h1 className='w-full text-center mb-4 font-medium py-2 text-lg text-slate-200'>
                How it works! 🤯
            </h1>
            <p className='w-full lg:w-[70%] mx-auto text-justify lg:text-center py-2 text-sm text-slate-400 leading-loose'>
                The (Talk-No Justu Tool) is built using <code>Next JS</code> specially for the <code>Supabase Launch Week 8 Hackathon</code>. The main focus of this tool is to receive any kind of problems aka "mental stress or anything you always wanted to shout at your friend" and process it using <code>Generative AI</code> - <code>Open AI</code> and provides you with a fun filled page of realistic anime voice using <code>Play HT</code> advising you with motivation or message. The thing to notice is due to empty pocket the entire site is running on free and open source resources and thus only two characters namely "Naruto Uzumaki" and "Gaara" are used.
            </p>
            <br/>
            <iframe loading="lazy" className={'lg:h-80 h-60 mx-auto my-4 lg:w-1/2 w-full'} src="https://www.loom.com/embed/adc5a2ca1ddb448b9d96adfd2186174e?sid=1b710eac-08c9-4fa2-9efd-1c7045f421d3" frameBorder="0" allowFullScreen></iframe>
            <br/>
            <p className='w-full lg:w-[70%] mx-auto text-justify lg:text-center py-2 text-sm text-slate-400 leading-loose'>
                <code>Supabase Authentication</code> is a great helper here, providing access to authenticate. Here I used, Authentication service to authenticate users and made sure only those you login will be able to access the tool and hear our naurto's no-talk jsutu.
            </p>
            <p className='w-full lg:w-[70%] mx-auto text-justify lg:text-center py-2 text-sm text-slate-400 leading-loose'>
                <code>Supabase Database & Storage</code> is used to save and relive the history and fall into naruto justu. Here all the voice files are stored as objects in supabase buckets and other data related to user like email, full name and motivational messages are stored into their postgresql databases.
            </p>
            <p className='w-full lg:w-[70%] mx-auto text-justify lg:text-center py-2 text-sm text-slate-400 leading-loose'>
                Not to mention, <code>Open AI</code> was a life saver providing me to generate qoutes or messages based on your problems described and character choosing via <code>text-davinci-003</code> mode. I made sure the result would defitely motivate you to atleast laugh 😅.
            </p>
            <p className='w-full lg:w-[70%] mx-auto text-justify lg:text-center py-2 text-sm text-slate-400 leading-loose'>
                Talking about <code>Play HT</code> voice services, I used voice clonig to generate Naruto and Gaara's voice to speak motivation lines for you. Here while intergrating this it really made be stop sleeping as it was really difficult to do it, but everything at the end was worth it.
            </p>
            <p className='w-full lg:w-[70%] mx-auto text-justify lg:text-center py-2 text-sm text-slate-400 leading-loose'>
                <code>GIPHY</code> here, played a small role but a strong one. It generated a random anime character based on the situation and helped to create the current environement via their apis.
            </p>
        </div>
    </div>
  )
}

export default HowItWorks