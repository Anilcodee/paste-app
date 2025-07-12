import React, { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToPastes, updateToPaste } from '../redux/pasteSlice';
import feather from 'feather-icons';
import toast from 'react-hot-toast';

const ViewPaste = () => {

  const textarearef = useRef(null);
  const linenumbersref = useRef(null);

  useEffect(() => {
      feather.replace();
  }, []);
  const {id} = useParams();
  const allPastes = useSelector((state) => state.paste.pastes);
  console.log(allPastes);
  const paste = allPastes.filter((p) => p._id === id)[0];
  console.log("Final Paste: ", paste);

  const handleScroll = () => {
    linenumbersref.current.scrollTop = textarearef.current.scrollTop;
  };

  const getLineNumbers = () => {
    console.log("HEllO");
    const lines = paste.content.split("\n").length || 1;
    const arr = [];
    for(let i = 1; i < lines+1; i++){
      arr[i-1] = i;
    }
    return arr.join("\n");
  }

  return (
    <div className='flex flex-col gap-7 items-center bg-black h-[100vh]'>
        <div className='w-[1280px] flex flex-row mt-16 items-center'>
          <div className='bg-[#4a4a4a]'>
            <input className='outline-none p-4 m-1 rounded-md w-[1280px] bg-black text-white'
            type="text" placeholder='Title' value={paste.title} onChange={(e) => setTitle(e.target.value)} disabled/>
          </div>
        </div>  
        <div className='mt-4 border-white bg-[#4a4a4a] min-w-[1280px]'>
        <div className='flex justify-between'>
          <div className='flex gap-2 items-center w-[100px] m-3'>
            <div className='h-[25px] w-[25px] rounded-full bg-red-600'></div>
            <div className='h-[25px] w-[25px] rounded-full bg-yellow-600'></div>
            <div className='h-[25px] w-[25px] rounded-full bg-green-600'></div>
          </div>
          <div className='m-4 rounded-md'>
            <button onClick={() => {
                navigator.clipboard.writeText(paste.content)
                toast.success("copied to clipboard")
                }}>
                <i data-feather="copy" className='copy'></i>
            </button>
          </div>
        </div>
        
        <div className='w-[1270px] flex m-1 p-4 border bg-black rounded-md'>
          <div className='w-[80px] bg-black p-2 rounded-md mt-1 ml-1 mr-1'>
                <pre ref={linenumbersref} className='text-white'>
                  {getLineNumbers()}
                </pre>
          </div>

          <textarea ref={textarearef} value={paste.content} onScroll={handleScroll} placeholder='Write Your Content Here....' onChange={(e) => setValue(e.target.value)} rows={25} cols={100} disabled className='outline-none p-2 rounded-md mt-1 ml-1 mr-1 min-w-[1200px] bg-black text-white'>

          </textarea>

        </div>
      </div>
    </div>
  )
}

export default ViewPaste
