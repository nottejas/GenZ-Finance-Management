import React, { useState } from 'react';
import { FaPlay, FaHeart, FaComment, FaBookmark, FaShare, FaTimes } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';

const ShortFormContent = ({ content, onClose }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [showComments, setShowComments] = useState(false);
  const { settings } = useSettings();
  
  // Get theme mode
  const isDarkMode = settings?.profile?.darkMode ?? true;
  
  const currentVideo = content[currentVideoIndex];
  
  const handleNext = () => {
    if (currentVideoIndex < content.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setShowComments(false);
    } else {
      // Loop back to the first video
      setCurrentVideoIndex(0);
      setShowComments(false);
    }
  };
  
  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setShowComments(false);
    } else {
      // Loop to the last video
      setCurrentVideoIndex(content.length - 1);
      setShowComments(false);
    }
  };
  
  const toggleLike = (id) => {
    setLiked(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const toggleSave = (id) => {
    setSaved(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  // Get base classes based on theme
  const bgColor = isDarkMode ? 'bg-black' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  
  return (
    <div className={`fixed inset-0 ${bgColor} z-50 flex flex-col`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <h2 className={`text-xl font-bold ${textColor}`}>Finance Tips</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-800"
        >
          <FaTimes className={textColor} />
        </button>
      </div>
      
      {/* Video Content */}
      <div className="flex-1 relative">
        {/* Video Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-9xl">{currentVideo.thumbnail}</div>
        </div>
        
        {/* Content Title & Creator */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white text-2xl font-bold mb-2">{currentVideo.title}</h3>
          <p className="text-gray-300">@{currentVideo.creator}</p>
        </div>
        
        {/* Navigation Overlay (touch left/right to navigate) */}
        <div className="absolute inset-0 flex">
          <div 
            className="w-1/2 h-full cursor-pointer" 
            onClick={handlePrevious}
          ></div>
          <div 
            className="w-1/2 h-full cursor-pointer" 
            onClick={handleNext}
          ></div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute right-4 bottom-20 flex flex-col space-y-6">
          {/* Like Button */}
          <button 
            onClick={() => toggleLike(currentVideo.id)}
            className="bg-gray-800 bg-opacity-60 w-12 h-12 rounded-full flex items-center justify-center"
          >
            <FaHeart 
              className={liked[currentVideo.id] ? 'text-red-500' : 'text-white'} 
              size={24} 
            />
          </button>
          
          {/* Comment Button */}
          <button 
            onClick={toggleComments}
            className="bg-gray-800 bg-opacity-60 w-12 h-12 rounded-full flex items-center justify-center"
          >
            <FaComment className="text-white" size={24} />
          </button>
          
          {/* Save Button */}
          <button 
            onClick={() => toggleSave(currentVideo.id)}
            className="bg-gray-800 bg-opacity-60 w-12 h-12 rounded-full flex items-center justify-center"
          >
            <FaBookmark 
              className={saved[currentVideo.id] ? 'text-yellow-500' : 'text-white'} 
              size={24} 
            />
          </button>
          
          {/* Share Button */}
          <button 
            className="bg-gray-800 bg-opacity-60 w-12 h-12 rounded-full flex items-center justify-center"
          >
            <FaShare className="text-white" size={24} />
          </button>
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-900 bg-opacity-95 rounded-t-3xl p-6 overflow-y-auto">
            <h4 className="text-white text-xl font-bold mb-4">Comments</h4>
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div>
                  <p className="text-white font-medium">JaneDoe</p>
                  <p className="text-gray-400">This tip helped me save ₹5000 last month!</p>
                  <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                    <span>5m ago</span>
                    <button className="hover:text-white">Like</button>
                    <button className="hover:text-white">Reply</button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white font-bold">JS</span>
                </div>
                <div>
                  <p className="text-white font-medium">JohnSmith</p>
                  <p className="text-gray-400">I've been doing this for years, works great!</p>
                  <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                    <span>12m ago</span>
                    <button className="hover:text-white">Like</button>
                    <button className="hover:text-white">Reply</button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">RK</span>
                </div>
                <div>
                  <p className="text-white font-medium">RaviKumar</p>
                  <p className="text-gray-400">Could you make a follow-up video on how to automate this?</p>
                  <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                    <span>25m ago</span>
                    <button className="hover:text-white">Like</button>
                    <button className="hover:text-white">Reply</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comment Input */}
            <div className="mt-6 flex">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="bg-gray-800 text-white px-4 py-3 rounded-full flex-1"
              />
              <button className="ml-2 bg-purple-600 px-4 rounded-full text-white">Post</button>
            </div>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="p-4">
        <div className="flex space-x-1">
          {content.map((_, index) => (
            <div 
              key={index} 
              className={`h-1 flex-1 rounded-full ${
                index === currentVideoIndex ? 'bg-white' : 'bg-gray-700'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortFormContent; 