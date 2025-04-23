import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useTranslation } from 'next-i18next';
import { useLanguage } from './LanguageManager';
import { getChatGptAnswer } from './callUtil';
import { CallHistoryType } from './CallHistory';


export interface MessageType {
  message: string;
  sender: string;
}


interface CallContextType {
  userCall: () => void;
  userSpeak: () => void;
  userStopSpeaking: () => void;
  listening: boolean;
  isCalling: boolean;
  endCall: () => void;
  handleSend: (message: string) => void;
  messages: MessageType[];
  isChatbotSpeaking: boolean;
  pauseThreshold: number;
  setPauseThreshold: (seconds: number) => void;
  useHalfDuplexMode: boolean;
  setUseHalfDuplexMode: (enabled: boolean)=> void;
}


const CallContext = createContext<CallContextType | undefined>(undefined);


type CallManagerProps = {
  children: React.ReactNode;
};


const CallManager: React.FC<CallManagerProps> = ({ children }) => {
  const isUserCalling = useRef(false);
  const isChatbotSpeaking = useRef(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef<string>('');
  const [pauseThreshold, setPauseThreshold] = useState<number>(2); // Default 2 second
  const [useHalfDuplexMode, setUseHalfDuplexMode]=useState(false);


  // Track if we're handling an interruption
  const isHandlingInterruption = useRef(false);
 
  // Keep track of when bot started speaking to implement cooldown period
  const botSpeechStartTimeRef = useRef<number>(0);
  const cooldownPeriodMs = 700; // Cooldown after bot starts speaking
 
  // Reference to AudioContext and nodes for echo cancellation
  const audioContextRef = useRef<AudioContext | null>(null);
  const speechDetectorRef = useRef<ScriptProcessorNode | null>(null);
  const isUserSpeakingRef = useRef<boolean>(false);
 
  // Energy threshold for distinguishing between user and bot speech
  const energyThresholdRef = useRef<number>(0.12);


  //Add a dynamic threshold adjuster that adapts to environment
  const dynamicThresholdAdjuster =useRef<{
    baselineEnergy: number;
    samples: number;
    adjustThreshold: () => void;
  }>({
    baselineEnergy: 0.05,
    samples: 0,
    adjustThreshold: function()
    {
      //Adjust threshold based on ambient noise level
      if(this.samples > 30)
      {
        energyThresholdRef.current=this.based*2.5;
        this.samples=0;
      }
    }
  });
 
  // Add a reference for the current speech content to help with fingerprinting
  const currentSpeechContentRef = useRef<string>('');



  const commands = [
    {
      command: ['*'],
      callback: (command: string) => {
        // Only process command when a significant change occurs
        if (command.trim() && command !== lastTranscriptRef.current) {
          handleUserSpeech(command);
        }
      },
    },
  ];


  const [isWinSpeaking, setIsWinSpeaking] = useState(isChatbotSpeaking.current);
  const [isCalling, setIsCalling] = useState(isUserCalling.current);
  const { transcript, resetTranscript, listening } = useSpeechRecognition({
    commands,
  });
  const { t } = useTranslation();
  const [userSpeechSynthesis, setUserSpeechSynthesis] = useState<SpeechSynthesis>();
  const [userLocalStorage, setUserLocalStorage] = useState<Storage>();
  const { selectedLanguage } = useLanguage();
  const defaultIntroduction = t('Win.introduction');
  const defaultMessage = [
    {
      message: defaultIntroduction,
      sender: 'ChatGPT',
    },
  ];
  const [messages, setMessages] = useState<MessageType[]>(defaultMessage);


  // Initialize audio context when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        setupAudioProcessing();
      } catch (error) {
        console.error("Error initializing AudioContext:", error);
      }
    }
   
    return () => {
      // Clean up audio context when component unmounts
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);


  // Set up audio processing for speech detection with echo cancellation
  const setupAudioProcessing = async () => {
    if (!audioContextRef.current) return;
   
    try {
      // Get user microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: {ideal: true},  // Enable browser's built-in echo cancellation
          noiseSuppression: {ideal: true},  // Enable noise suppression
          autoGainControl:  {ideal: true},
          channelCount: 1,
          echoCancellationType: "system"
        }
      });
     
      // Create audio source from microphone
      const micSource = audioContextRef.current.createMediaStreamSource(stream);

      //const lowFilter for frequency-selective processing
      const lowFilter = audioContextRef.current.createBiquadFilter();
      lowfilter.type = "lowself";
      lowfilter.gain = -6

      const highFilter = audioContextRef.current.createBiquadFilter();
      highFilter.type ="highself";
      highFilter.frequency = 3000;
      highFilter.gain = -6


      //Modify your connection chain
      micSource.connect(lowfilter);
      lowfilter.connect(highFilter);
      highFilter.connect(processor);
     
      // Create script processor for analyzing audio
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      speechDetectorRef.current = processor;
      
      // Add feedback detection variables
      let feedbackSampleCount = 0;
      //micSource.connect(processor);
      const maxGainLevel =0.9;
     
      // Process audio data to detect speech with enhanced echo cancellation
      processor.onaudioprocess = (e) => {
        if (isChatbotSpeaking.current && !isUserSpeakingRef.current) {
          dynamicThresholdAdjuster.current.baselineEnergy=
          dynamicThresholdAdjuster.current.baselineEnergy * 0.95 +speechEnergy * 0.05;
          dynamicThresholdAdjuster.current.adjustThreshold();
          }

          const inputData =e.inputBuffer.getChannelData(0);
          let peakLevel = 0;
          for (let i=0; i < inputData.length; i++)
          {
            peakLevel =Math.max(peakLevel, Math.abs(inputData[i]));
          }

          //check for characteristics of feedback 
          if (peakLevel > maxGainLevel)
          {
            feedbackSamplesCount++;

            if(feedbackSampleCount > 5)
            {
              emergencyMute();
              return;
            }
          }else{
            feedbackSamplesCount = Math.max(0, feedbackSampleCount - 1);
          }
         
          // Calculate audio energy in human speech frequency range
          const speechEnergy = calculateSpeechEnergy(input);
         
          // If energy exceeds threshold, likely user is speaking
          if (speechEnergy > energyThresholdRef.current) {
            if (!isUserSpeakingRef.current) {
              isUserSpeakingRef.current = true;
             
              // Add debounce to prevent false triggers
              setTimeout(() => {
                if (isUserSpeakingRef.current) {
                  console.log("User interrupted - human speech detected");
                  handleInterruption();
                }
              }, 180); // Wait 180ms to confirm consistent speech
            }
          } else {
            isUserSpeakingRef.current = false;
          }
        }

     
      // Connect but with gain node to control volume going to output
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 0; // Set to 0 to prevent audio feedback to speakers
     
      processor.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
     
      // Disconnect when not needed
      if (!isChatbotSpeaking.current) {
        processor.disconnect();
      }
     
    }
    catch (error) {
      console.error("Error setting up audio processing:", error);
    }
  };
  const emergencyMute = () =>
  {
    console.log("Feedback detected! Emergency mute activated.");
    if(userSpeechSynthesis && speechUtteranceRef.current)
    {
      userSpeechSynthesis.cancel();
    }
    isChatbotSpeaking.current =false;
    setIsWinSpeaking(false);

    //create visual feedback for User
    setMessages(messages=>[
      ...message,
      {
        message:"Audio Feedback detected. Adusting volume levels...",
        sender: 'System'
      }
    ]);

    //Allow system to recover before continuing
    isHandlingInterruption.current=true;
    setTimeout(()=>{
      isHandlingInterruption.current=false;
    },2000);
  };

  // Calculate energy specifically in human speech frequency ranges
  const calculateSpeechEnergy = (buffer: Float32Array): number => {
    let sum = 0;
    const bufferLength = buffer.length;

    //Focus on human Speech frequency range (300Hz-3000Hz)
    //For a 4096 buffer at 48kHz, this is approximately indices 25-250

    const speechStartIdx = Math.floor(bufferLength * 0.02); //~300Hz
    const speechEndIdx = Math.floor(bufferLength + 0.06); //~3000Hz
   
    for (let i = speechStartIdx; i < bufferLength; i++) {
      sum += Math.abs(buffer[i]);
    }
   
    return sum / (speechEndIdx-speechStartIdx);
  };



  useEffect(() => {
    setUserSpeechSynthesis(window.speechSynthesis);
    setUserLocalStorage(localStorage);
  }, []);


  // if selectedLanguage changes, reset call
  useEffect(() => {
    endCall();
  }, [defaultIntroduction, selectedLanguage]);


  // Monitor transcript changes to detect interruptions
  useEffect(() => {
    if (isChatbotSpeaking.current && transcript && transcript !== lastTranscriptRef.current) {
      // Check if we're outside the cooldown period
      const timeSinceBotStarted = Date.now() - botSpeechStartTimeRef.current;
      if (timeSinceBotStarted > cooldownPeriodMs) {
        // User is speaking while the bot is speaking - handle interruption
        if (transcript.trim().length > 3) { // Avoid triggering on small noises
          // Validate that this isn't an echo of bot's own voice
          if (!isEchoOfBotSpeech(transcript)) {
            handleInterruption();
          }
        }
      }
    }
   
    // Store the current transcript for comparison
    if (transcript) {
      lastTranscriptRef.current = transcript;
    }
   
    // Reset pause timer when user speaks
    if (transcript && transcript.trim() && pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
   
    // Set pause timer when user stops speaking
    if (listening && transcript && !pauseTimerRef.current && !isChatbotSpeaking.current) {
      pauseTimerRef.current = setTimeout(() => {
        // Process the transcript after pause
        if (transcript.trim()) {
          handleSend(transcript);
          resetTranscript();
        }
        pauseTimerRef.current = null;
      }, pauseThreshold * 1000);
    }
  }, [transcript, listening, pauseThreshold]);


  // Simplified echo detection
  const isEchoOfBotSpeech = (transcriptText: string): boolean => {
    if (!currentSpeechContentRef.current || transcriptText.length < 3) return false;
   
    // Normalize strings for comparison (lowercase, remove punctuation)
    const normalizeText = (text: string) => text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
   
    const normalizedTranscript = normalizeText(transcriptText);
    const normalizedBotSpeech = normalizeText(currentSpeechContentRef.current);

    const transcriptWords = normalizedTranscript.split(/\s+/);
    const botWords = normalizedBotSpeech.split(/\s+/)

    if (transcriptWords.length <=2)
    {
      return normalizedBotSpeech.includes(normalizedTranscript);
    }

    //count matching Words
    let matchingWords =0;
    for (const word of transcriptWords){
      if(word.length > 2 && botWords.includes(word))
      {
        matchingWords++;
      }
    } 
    const matchPercent =matchingWords/transcriptWords.length
    
    // consider it an echo if more than 60% words match
    return matchPercent > 0.6;
    };


  // Connect/disconnect audio processor based on bot speaking state
  useEffect(() => {
    if (speechDetectorRef.current && audioContextRef.current) {
      if (isChatbotSpeaking.current) {
        // Connect the processor when bot starts speaking to detect interruptions
        try {
          speechDetectorRef.current.connect(audioContextRef.current.destination);
        } catch (error) {
          console.error("Error connecting speech detector:", error);
        }
      } else {
        // Disconnect when bot stops speaking to save resources
        try {
          speechDetectorRef.current.disconnect();
        } catch (error) {
          // Ignore disconnection errors
        }
      }
    }
  }, [isWinSpeaking]);


  const handleInterruption = () => {
    if (isChatbotSpeaking.current && !isHandlingInterruption.current) {
      isHandlingInterruption.current = true;
      console.log("User interrupted - stopping bot speech");
     
      // Stop the current speech
      if (userSpeechSynthesis && speechUtteranceRef.current) {
        userSpeechSynthesis.cancel();
      }
     
      // Reset speaking state
      isChatbotSpeaking.current = false;
      setIsWinSpeaking(false);
      currentSpeechContentRef.current = '';
     
      // Short delay to prevent race conditions
      setTimeout(() => {
        isHandlingInterruption.current = false;
      }, 500);
    }
  };


  const handleUserSpeech = (userInput: string) => {
    // Reset pause timer if exists
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
   
    // Set new pause timer
    pauseTimerRef.current = setTimeout(() => {
      if (userInput.trim()) {
        handleSend(userInput);
        resetTranscript();
      }
      pauseTimerRef.current = null;
    }, pauseThreshold * 1000);
  };


  const chatBotSpeak = (message: string) => {
    if (!userSpeechSynthesis || !isUserCalling.current) {
      return;
    }

    //half duplex mode handling
    if( useHalfDuplexMode)
    {
      SpeechRecognition.stopListening();
    }


    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      userSpeechSynthesis.speak(
        new SpeechSynthesisUtterance(t('Win.browserNotSupportSpeechRecognitionMessage'))
      );
      return;
    }
   
    // Store speech content for echo detection
    currentSpeechContentRef.current = message;
   
    // Create and store the utterance object so we can cancel it if interrupted
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = selectedLanguage;
    utterance.onstart = handleChatbotSpeechStart;
    utterance.onend = handleChatbotSpeechEnd;
   
    // Add properties for clear speech
    utterance.volume = 1.0; // Full volume for clarity
    utterance.rate = 1.0;   // Normal speech rate
    utterance.pitch = 1.0;  // Normal pitch
   
    speechUtteranceRef.current = utterance;
   
    userSpeechSynthesis.speak(utterance);
  };


  const handleChatbotSpeechStart = () => {
    isChatbotSpeaking.current = true;
    setIsWinSpeaking(true);
   
    // Record the time when bot started speaking for cooldown implementation
    botSpeechStartTimeRef.current = Date.now();
   
    // Reset user speaking detection
    isUserSpeakingRef.current = false;
   
    // Start or ensure recognition is running to detect interruptions
    if (!listening) {
      SpeechRecognition.startListening({
        language: selectedLanguage,
        continuous: true
      });
    }
  };


  const handleChatbotSpeechEnd = () => {
    isChatbotSpeaking.current = false;
    setIsWinSpeaking(false);
    speechUtteranceRef.current = null;
    currentSpeechContentRef.current = '';
    isUserSpeakingRef.current = false;
   
    // Keep listening for user input
    if (isUserCalling.current && !listening) {
      SpeechRecognition.startListening({
        language: selectedLanguage,
        continuous: true
      });
    }
    if(useHalfDuplexMode)
    {
      setTimeout(() =>
      {
        if (isUserCalling.current && !listening)
        {
          SpeechRecognition.startListening({
            language: selectedLanguage,
            continuous: true
          });
        }
      },100);
    }
  };


  const handleSend = async (message: string) => {
    if (!message) {
      return;
    }
    const formattedMessage = {
      message,
      sender: 'user',
    };


    const updatedMessages = [...messages, formattedMessage];


    setMessages(updatedMessages);


    // Call from conversation ideas
    if (!isUserCalling.current) {
      isUserCalling.current = true;
      setIsCalling(isUserCalling.current);
    }
   
    // If bot is speaking, stop it
    if (isChatbotSpeaking.current) {
      userSpeechSynthesis?.cancel();
      isChatbotSpeaking.current = false;
      setIsWinSpeaking(false);
    }
   
    const chatGPTAnswer = await getChatGptAnswer(updatedMessages);
    setMessages([
      ...updatedMessages,
      {
        message: chatGPTAnswer,
        sender: 'ChatGPT',
      },
    ]);
    chatBotSpeak(chatGPTAnswer);
  };


  const userSpeak = () => {
    // Start listening continuously
    SpeechRecognition.startListening({
      language: selectedLanguage,
      continuous: true
    });


    if (transcript !== '') {
      resetTranscript();
    }
  };
 
  const userStopSpeaking = () => {
    SpeechRecognition.stopListening();
   
    // Process any pending transcript
    if (transcript.trim()) {
      handleSend(transcript);
      resetTranscript();
    }
   
    // Clear any pending pause timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  };


  const userCall = () => {
    isUserCalling.current = true;
    setIsCalling(isUserCalling.current);


    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      setMessages([
        ...messages,
        {
          message: t('Win.browserNotSupportSpeechRecognitionMessage'),
          sender: 'ChatGPT',
        },
      ]);
      isUserCalling.current = false;
      setIsCalling(isUserCalling.current);
      return;
    }


    const firstMessage = t('Win.firstMessage');
    const formattedMessage = {
      message: firstMessage,
      sender: 'assistant',
    };


    const updatedMessages = [...messages, formattedMessage];


    setMessages(updatedMessages);
   
    // Start listening before the bot speaks
    SpeechRecognition.startListening({
      language: selectedLanguage,
      continuous: true
    });
   
    chatBotSpeak(firstMessage);
  };


  const updateCallHistory = () => {
    if (userLocalStorage && messages.length > 1) {
      const storage = userLocalStorage.getItem('callHistory')
        ? JSON.parse(userLocalStorage.getItem('callHistory') as string)
        : [];
      const newCallHistory: CallHistoryType[] = [...storage, { messages, date: new Date().toLocaleString() }];
      userLocalStorage?.setItem('callHistory', JSON.stringify(newCallHistory));
    }
  };


  const hangUp = () => {
    // Clear any pending pause timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
   
    // Disconnect audio processor if active
    if (speechDetectorRef.current && audioContextRef.current &&
        speechDetectorRef.current.context.state !== 'closed') {
      try {
        speechDetectorRef.current.disconnect();
      } catch (error) {
        // Ignore errors on disconnection
      }
    }
   
    SpeechRecognition.stopListening();
    setMessages(defaultMessage);
    isUserCalling.current = false;
    setIsCalling(isUserCalling.current);
    currentSpeechContentRef.current = '';
   
    if (isChatbotSpeaking.current) {
      userSpeechSynthesis?.cancel();
      isChatbotSpeaking.current = false;
      setIsWinSpeaking(false);
      speechUtteranceRef.current = null;
    }
   
    SpeechRecognition.abortListening();
    resetTranscript();
  };


  const endCall = () => {
    hangUp();
    updateCallHistory();
  };


  const updatePauseThreshold = (seconds: number) => {
    if (seconds >= 0.5 && seconds <= 5) {
      setPauseThreshold(seconds);
    }
  };


  return (
    <CallContext.Provider
      value={{
        userCall,
        userSpeak,
        userStopSpeaking,
        listening,
        isCalling,
        endCall,
        handleSend,
        messages,
        isChatbotSpeaking: isWinSpeaking,
        pauseThreshold,
        setPauseThreshold: updatePauseThreshold,
        useHalfDuplexMode,
        setUseHalfDuplexMode,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};


export const useCallManager = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCallManager must be used within a CallManager');
  }
  return context;
};


export default CallManager;
