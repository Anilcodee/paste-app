import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import feather from 'feather-icons';
import toast from 'react-hot-toast';

const ViewPaste = () => {
  const textarearef = useRef(null);
  const linenumbersref = useRef(null);
  
  useEffect(() => {
    feather.replace();
  }, []);

  const { id } = useParams();
  const allPastes = useSelector((state) => state.paste.pastes);
  
  // Add error handling for when paste is not found
  const paste = allPastes.find((p) => p._id === id);
  
  // If paste not found, show error message
  if (!paste) {
    return (
      <div className='flex flex-col gap-7 items-center bg-black h-[100vh] justify-center'>
        <div className='text-white text-xl'>Paste not found!</div>
      </div>
    );
  }

  const handleScroll = () => {
    if (linenumbersref.current && textarearef.current) {
      linenumbersref.current.scrollTop = textarearef.current.scrollTop;
    }
  };

  const getLineNumbers = () => {
    if (!paste || !paste.content) return '1';
    
    const lines = paste.content.split("\n").length || 1;
    const arr = [];
    for (let i = 1; i < lines + 1; i++) {
      arr[i - 1] = i;
    }
    return arr.join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      toast.success("Copied to clipboard");
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = paste.content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className='flex flex-col gap-7 items-center bg-black h-[100vh]'>
      <div className='w-[1280px] flex flex-row mt-16 items-center'>
        <div className='bg-[#4a4a4a]'>
          <input 
            className='outline-none p-4 m-1 rounded-md w-[1280px] bg-black text-white'
            type="text" 
            placeholder='Title' 
            value={paste.title || ''} 
            readOnly
            disabled
          />
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
            <button onClick={handleCopy} className='text-white hover:text-gray-300'>
              <i data-feather="copy" className='copy'></i>
            </button>
          </div>
        </div>
        
        <div className='w-[1270px] flex m-1 p-4 border bg-black rounded-md'>
          <div className='w-[80px] bg-black p-2 rounded-md mt-1 ml-1 mr-1'>
            <pre ref={linenumbersref} className='text-white overflow-hidden'>
              {getLineNumbers()}
            </pre>
          </div>
          <textarea 
            ref={textarearef} 
            value={paste.content || ''} 
            onScroll={handleScroll} 
            placeholder='Write Your Content Here....' 
            rows={25} 
            cols={100} 
            readOnly
            disabled 
            className='outline-none p-2 rounded-md mt-1 ml-1 mr-1 min-w-[1200px] bg-black text-white resize-none'
          />
        </div>
      </div>
    </div>
  );
};

export default ViewPaste;
