import React, { useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, MessageSquare, 
  Share, Settings, Phone, FileText, Paperclip,
  X, Send
} from 'lucide-react';

const TelemedicineInterface = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="h-screen flex">
        {/* Main Video Area */}
        <div className={`flex-1 flex flex-col ${isChatOpen ? 'lg:mr-96' : ''}`}>
          {/* Session Info */}
          <div className="bg-gray-800 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Dr. Sarah Johnson</h1>
                <p className="text-gray-400">Cardiology Consultation</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm">Connected</span>
                </span>
                <span className="text-sm text-gray-400">Duration: 15:23</span>
              </div>
            </div>
          </div>

          {/* Video Feeds */}
          <div className="flex-1 relative">
            {/* Doctor's Video (Main) */}
            <div className="absolute inset-0 p-4">
              <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                <img
                  src="/api/placeholder/800/600"
                  alt="Doctor video feed"
                  className="rounded-lg"
                />
              </div>
            </div>
            
            {/* Patient's Video (Picture-in-Picture) */}
            <div className="absolute bottom-8 right-8 w-64 h-48 bg-gray-800 rounded-lg shadow-lg">
              <img
                src="/api/placeholder/256/192"
                alt="Patient video feed"
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="h-20 bg-gray-800 flex items-center justify-center gap-4 px-4">
            <ControlButton
              icon={isMuted ? <MicOff /> : <Mic />}
              label={isMuted ? "Unmute" : "Mute"}
              onClick={() => setIsMuted(!isMuted)}
              active={!isMuted}
            />
            <ControlButton
              icon={isVideoOff ? <VideoOff /> : <Video />}
              label={isVideoOff ? "Start Video" : "Stop Video"}
              onClick={() => setIsVideoOff(!isVideoOff)}
              active={!isVideoOff}
            />
            <ControlButton
              icon={<Share />}
              label="Share Screen"
              onClick={() => {}}
            />
            <ControlButton
              icon={<MessageSquare />}
              label="Chat"
              onClick={() => setIsChatOpen(!isChatOpen)}
              active={isChatOpen}
            />
            <ControlButton
              icon={<Settings />}
              label="Settings"
              onClick={() => {}}
            />
            <ControlButton
              icon={<Phone />}
              label="End Call"
              onClick={() => {}}
              className="bg-red-600 hover:bg-red-700"
            />
          </div>
        </div>

        {/* Chat Panel */}
        {isChatOpen && (
          <div className="hidden lg:flex flex-col w-96 bg-gray-800 border-l border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-white font-semibold">Chat</h2>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <ChatMessage
                sender="Dr. Sarah Johnson"
                message="Hello! How are you feeling today?"
                time="2:30 PM"
                isDoctor
              />
              <ChatMessage
                sender="You"
                message="Hi Dr. Johnson! I've been experiencing some chest pain lately."
                time="2:31 PM"
              />
              <ChatMessage
                sender="Dr. Sarah Johnson"
                message="I see. Can you describe the pain and when it typically occurs?"
                time="2:31 PM"
                isDoctor
              />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-white">
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="p-2 text-blue-500 hover:text-blue-400">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ControlButton = ({ icon, label, onClick, active = true, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center px-4 py-2 rounded-lg text-sm ${
      active 
        ? "text-white hover:bg-gray-700" 
        : "text-red-500 bg-gray-700 hover:bg-gray-600"
    } ${className}`}
  >
    {icon}
    <span className="mt-1">{label}</span>
  </button>
);

const ChatMessage = ({ sender, message, time, isDoctor = false }) => (
  <div className={`flex flex-col ${isDoctor ? "items-start" : "items-end"}`}>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-sm text-gray-400">{sender}</span>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
      isDoctor 
        ? "bg-gray-700 text-white" 
        : "bg-blue-600 text-white"
    }`}>
      {message}
    </div>
  </div>
);

export default TelemedicineInterface;