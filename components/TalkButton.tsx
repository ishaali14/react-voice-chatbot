import React from 'react';
import { useTranslation } from 'next-i18next';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';


interface TalkButtonProps {
  userCall: () => void;
  userSpeak: () => void;
  userStopSpeaking: () => void;
  listening: boolean;
  isCalling: boolean;
  endCall: () => void;
  isChatbotSpeaking: boolean;
}


export default function TalkButton({
  userCall,
  userSpeak,
  userStopSpeaking,
  listening,
  isCalling,
  endCall,
  isChatbotSpeaking,
}: TalkButtonProps) {
  const { t } = useTranslation();
 
  if (!isCalling) {
    return (
      <button
        className="w-48 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
        onClick={userCall}
      >
        <Phone size={20} className="mr-2" />
        {t('call.call')}
      </button>
    );
  }


  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {listening ? (
          <button
            className="w-16 h-16 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center focus:outline-none transition-all duration-300"
            onClick={userStopSpeaking}
          >
            <div className="relative flex h-12 w-12">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 dark:bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-12 w-12 bg-red-500 dark:bg-red-600 justify-center items-center">
                <MicOff size={24} className="text-white" />
              </span>
            </div>
          </button>
        ) : (
          <button
            className={`w-16 h-16 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center focus:outline-none transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-600`}
            onClick={userSpeak}
          >
            <div className="relative flex h-12 w-12">
              <span className={`${isChatbotSpeaking ? '' : 'animate-pulse'} relative inline-flex rounded-full h-12 w-12 bg-blue-600 dark:bg-blue-500 justify-center items-center`}>
                <Mic size={24} className="text-white" />
              </span>
            </div>
          </button>
        )}
       
        {/* Always-on mic indicator for interrupt capability */}
        {isChatbotSpeaking && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            <Mic size={12} />
          </div>
        )}
      </div>
     
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        {isChatbotSpeaking ? t('listeningForInterruptions', 'You can interrupt') : (listening ? t('listeningActive', 'Listening...') : t('tapToSpeak', 'Tap to speak'))}
      </div>
     
      <button
        className="w-48 h-12 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 flex items-center justify-center"
        onClick={endCall}
      >
        <PhoneOff size={20} className="mr-2" />
        {t('call.hangUp')}
      </button>
    </div>
  );
}
