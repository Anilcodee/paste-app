import React, { useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';
import feather from 'feather-icons'
import './Paste.css'


const Paste = () => {
  useEffect(() => {
      feather.replace();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const pastes = useSelector((state) => 
  state.paste.pastes);
  console.log(pastes);
  const dispatch = useDispatch();
  const filteredData = pastes.filter((paste) => paste.title.toLowerCase().includes(searchTerm.toLowerCase()));

  function handleDelete(pasteId){
    dispatch(removeFromPastes(pasteId));
  }

  const handleshare = async() => {
    if(navigator.share){
      try{
        await navigator.share({
          title: document.title,
          text: "Check out this page!",
          url: window.location.href,
        });
      }catch(error){
        console.error("Error sharing:", error);
      }
    }else{
      alert("Sharing is not supported in your browser.");
    };
  }
  return (
    <div className='flex flex-col gap-7 items-center h-[100vh] bg-black'>
      <div className='rounded-md bg-[#4a4a4a] mt-16 w-[1280px] flex justify-between'>
        <input className='rounded-md bg-black m-1 w-[1260px] p-4 text-white outline-none'
        type="search" placeholder='Search Here....' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        <i data-feather='search' className='search m-4'></i>
      </div>
        

      <div className='flex flex-col mt-4 w-[1280px] items-center rounded-md bg-[#4a4a4a]'>
        {
          filteredData.length >  0 && 
          filteredData.map(
            (paste) => {
              return (
                <div className='w-[1275px] m-1 rounded-md text-white bg-black p-4' key={paste?._id}>
                  <div className='flex flex-row items-baseline justify-between pr-4'>
                    <div className='flex flex-col gap-4'>
                      <div className='text-3xl'>
                        {paste.title}
                      </div>
                      <div>
                        {paste.content}
                      </div>
                    </div>
                 
                    <div className='flex flex-row gap-4 place-content-evenly'>
                      <button className='bg-[#4a4a4a] p-2 rounded-md hover:bg-[#292323]'>
                          <a href={`/?pasteId=${paste?._id}`}>Edit</a>
                      </button>
                      <button className='bg-[#4a4a4a] p-2 rounded-md hover:bg-[#292323]'>
                        <a href={`/pastes/${paste?._id}`}>
                          View
                        </a>
                      </button>
                      <button className='bg-[#4a4a4a] p-2 rounded-md hover:bg-[#292323]' onClick={() => handleDelete(paste?._id)}>
                        Delete
                      </button>
                      <button className='bg-[#4a4a4a] p-2 rounded-md hover:bg-[#292323]' onClick={() => {
                        navigator.clipboard.writeText(paste?.content)
                        toast.success("copied to clipboard")
                      }}>
                        Copy
                      </button>
                      <button className='bg-[#4a4a4a] p-2 rounded-md hover:bg-[#292323]' onClick={handleshare}>
                        share
                      </button>
                    </div>
                  </div>

                  <div className='mt-5 flex justify-center'>
                    {paste.createdAt.split('T')[0]}
                  </div>
                </div>
                
              )
            }
          )
        }
      </div>
    </div>
  )
}

export default Paste
