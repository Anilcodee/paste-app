import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToPastes, updateToPaste } from '../redux/pasteSlice';
import toast from 'react-hot-toast';
import feather from 'feather-icons'

const Home = () => {

    useEffect(() => {
    feather.replace();
    }, []);

    const textarearef = useRef(null);
    const linenumbersref = useRef(null);
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const pasteId = searchParams.get("pasteId");
    const dispatch = useDispatch();
    const allPastes = useSelector((state) => state.paste.pastes);
    useEffect(() => {
        if(pasteId){
          const paste = allPastes.find((p) => p._id === pasteId);
          setTitle(paste.title);
          setValue(paste.content);
        }
      
      }, [pasteId])
    function createPaste(){
      const paste = {
        title: title,
        content: value,
        _id: pasteId || Date.now().toString(36),
        createdAt: new Date().toISOString(),
      }
      
      if(pasteId){
        //update
        dispatch(updateToPaste(paste));
      }
      else{
        //create
        dispatch(addToPastes(paste));
      }

      //after creation and updation

      setTitle('');
      setValue('');
      setSearchParams({});
    }

  const handleScroll = () => {
    linenumbersref.current.scrollTop = textarearef.current.scrollTop;
  };

  const getLineNumbers = () => {
    console.log("HEllO");
    const lines = value.split("\n").length || 1;
    const arr = [];
    for(let i = 1; i < lines+1; i++){
      arr[i-1] = i;
    }
    return arr.join("\n");
  }
  return (
    <div className='flex flex-col gap-7 items-center bg-black h-[100vh]'>
      <div className='w-[1280px] flex flex-row mt-16 items-center justify-between'>
        <div className='bg-[#4a4a4a]'>
          <input className='outline-none p-4 m-1 rounded-md w-[900px] bg-black text-white'
          type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='bg-[#4a4a4a]'>
          <button className='p-4 m-1 bg-black rounded-md text-white hover:bg-[#292323] overflow-hidden' onClick={createPaste}>
          {
              pasteId ? "Update My Paste" : "Create My Paste"
          }
          </button>
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
                navigator.clipboard.writeText(value)
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

          <textarea ref={textarearef} value={value} onScroll={handleScroll} placeholder='Write Your Content Here ....' onChange={(e) => setValue(e.target.value)} rows={25} cols={100} className='outline-none p-2 rounded-md mt-1 ml-1 mr-1 min-w-[1200px] bg-black text-white'>

          </textarea>

        </div>
      </div>
    </div>
  )
}

export default Home
