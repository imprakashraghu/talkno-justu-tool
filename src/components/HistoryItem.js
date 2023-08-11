import React from 'react'

function HistoryItem({ onClick=oc=>oc, item }) {
  return (
    <div 
        onClick={() => onClick(item)}
        key={item?.id} className='cursor-pointer hover:bg-slate-900 rounded-md w-full border-b border-gray-700 pb-2 flex items-center justify-between p-2'>
        <p className='text-white text-left text-sm flex items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hover:text-orange-500 text-slate-600 w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        {item?.character}</p>
        <p className='text-sm text-slate-400 text-right'>{new Date(item?.updated_at).toDateString()+", "+new Date(item?.updated_at).toLocaleTimeString('en-US',{timeStyle:'short'})}</p>
    </div>
  )
}

export default HistoryItem