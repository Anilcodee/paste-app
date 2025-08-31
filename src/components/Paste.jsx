import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeFromPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';
import feather from 'feather-icons'
import './Paste.css'

const Paste = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    feather.replace();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const pastes = useSelector((state) => state.paste.pastes);
  console.log(pastes);
  const dispatch = useDispatch();
  
  const filteredData = pastes.filter((paste) => 
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleDelete(pasteId) {
    dispatch(removeFromPastes(pasteId));
    toast.success("Paste deleted successfully");
  }

  const handleEdit = (pasteId) => {
    navigate(`/?pasteId=${pasteId}`);
  };

  const handleView = (pasteId) => {
    console.log("Navigating to paste:", pasteId); // Debug log
    navigate(`/pastes/${pasteId}`);
  };

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success("Copied to clipboard");
    }
  };

  const handleShare = async (paste) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: paste.title || 'Shared Paste',
          text: "Check out this paste!",
          url: `${window.location.origin}/pastes/${paste._id}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to copying URL
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/pastes/${paste._id}`);
          toast.success("URL copied to clipboard");
        } catch (clipboardError) {
          toast.error("Sharing failed");
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/pastes/${paste._id}`);
        toast.success("URL copied to clipboard");
      } catch (error) {
        toast.error("Sharing not supported in your browser");
      }
    }
  };

  return (
    <div className='flex flex-col gap-7 items-center h-[100vh] bg-black'>
      <div className='rounded-md bg-[#4a4a4a] mt-16 w-[1280px] flex justify-between'>
        <input 
          className='rounded-md bg-black m-1 w-[1260px] p-4 text-white outline-none'
          type="search" 
          placeholder='Search Here....' 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i data-feather='search' className='search m-4'></i>
      </div>
        
      <div className='flex flex-col mt-4 w-[1280px] items-center rounded-md bg-[#4a4a4a]'>
        {filteredData.length > 0 ? (
          filteredData.map((paste) => {
            // Debug: Check what ID field exists
            const pasteId = paste._id || paste.id;
            console.log("Paste object:", paste, "ID:", pasteId);
            
            return (
              <div className='w-[1275px] m-1 rounded-md text-white bg-black p-4' key={pasteId}>
                <div className='flex flex-row items-baseline justify-between pr-4'>
                  <div className='flex flex-col gap-4'>
                    <div className='text-3xl'>
                      {paste.title || 'Untitled'}
                    </div>
                    <div className='max-h-20 overflow-hidden text-ellipsis'>
                      {paste.content && paste.content.length > 100 
                        ? `${paste.content.substring(0, 100)}...` 
                        : paste.content || 'No content'}
                    </div>
                  </div>
               
                  <div className='flex flex-row gap-4 place-content-evenly'>
                    <button 
                      className='bg-[#4a4a4a] p-2 rounded-md hover:bg-[#292323] text-white'
                      onClick={() => handleEdit(pasteId)}
                    >
                      Edit
                    </button>
                    <button 
                      className='bg-[#4a4a4a] p-2 rounded-md hover:bg-[#292323] text-white'
                      onClick={() => handleView(pasteId)}
                    >
                      View
                    </button>
                    <button 
                      className='bg-[#4a4a4a] p-2 rounded-md hover:bg-[#292323] text-white' 
                      onClick={() => handleDelete(pasteId)}
                    >
                      Delete
                    </button>
                    <button 
                      className='bg-[#4a4a4a] p-2 rounded-md hover:bg-[#292323] text-white' 
                      onClick={() => handleCopy(paste.content)}
                    >
                      Copy
                    </button>
                    <button 
                      className='bg-[#4a4a4a] p-2 rounded-md hover:bg-[#292323] text-white' 
                      onClick={() => handleShare(paste)}
                    >
                      Share
                    </button>
                  </div>
                </div>
                <div className='mt-5 flex justify-center text-gray-400'>
                  {paste.createdAt ? new Date(paste.createdAt).toLocaleDateString() : 'No date'}
                </div>
              </div>
            );
          })
        ) : (
          <div className='text-white p-8'>
            {searchTerm ? 'No pastes found matching your search.' : 'No pastes available.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Paste;
