import React, { useEffect } from 'react'

function Loading() {

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
        <img
            alt='talk-no-justu'
            src='./loading.gif'
            className='object-contain h-60'
        />
        <h1 className='glow__text w-full py-3 text-white uppercase text-lg font-bold text-center'>
            TALK-NO JUSTU
        </h1>
    </div>
  )
}

export default Loading