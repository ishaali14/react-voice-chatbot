import 'regenerator-runtime/runtime';
import React from 'react';
import MessageBox from './MessageBox';
import TalkButton from './TalkButton';
import { useCallManager } from './CallManager';
import { useTheme } from './ThemeContext';
import { Mic } from 'lucide-react';

export default function CallWin() {
  const {
    userCall,
    userSpeak,
    userStopSpeaking,
    listening,
    isCalling,
    endCall,
    handleSend,
    messages,
    isChatbotSpeaking,
  } = useCallManager();
  
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between h-full w-full max-w-6xl mx-auto">
      {/* Assistant Icon/Avatar Section */}
     <div className="lg:w-1/2 flex justify-center items-center p-6">
  <div className="relative w-64 h-64 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center overflow-hidden transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-gray-50 dark:from-blue-900/30 dark:to-gray-800 opacity-60 transition-colors duration-300"></div>
    <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${isChatbotSpeaking ? 'scale-110' : ''} overflow-hidden`}>
      <img 
        src="/assets/winwin.webp" 
        alt="WinWin the Penguin" 
        className="w-full h-full object-cover filter saturate-200 contrast-125"
      />
      {isChatbotSpeaking && (
        <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/20 rounded-full animate-ping"></div>
      )}
    </div>
  </div>
</div>
      
      {/* Conversation Section */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center space-y-8 p-6 w-full">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 p-6 min-h-[180px] flex items-center justify-center transition-all duration-300">
          <MessageBox message={messages.length > 0 ? messages[messages.length - 1].message : "How can I help you today?"} />
        </div>
        
        <div className="flex flex-col items-center space-y-6 w-full max-w-md">
          <TalkButton
            userCall={userCall}
            userSpeak={userSpeak}
            userStopSpeaking={userStopSpeaking}
            listening={listening}
            isCalling={isCalling}
            endCall={endCall}
            isChatbotSpeaking={isChatbotSpeaking}
          />
          
          <div className="w-full">
            {/* {!isCalling && (
              <div className="flex space-x-2 justify-center">
                <button className="px-3 py-1 rounded-full text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">Weather</button>
                <button className="px-3 py-1 rounded-full text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">News</button>
                <button className="px-3 py-1 rounded-full text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">Help</button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

