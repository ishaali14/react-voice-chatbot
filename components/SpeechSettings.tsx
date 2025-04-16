import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useCallManager } from './CallManager';
import { Slider, Modal, Button } from 'antd';
import { Settings } from 'lucide-react';


export default function SpeechSettings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { pauseThreshold, setPauseThreshold } = useCallManager();
 
  // Track the temporary value while sliding
  const [tempThreshold, setTempThreshold] = useState(pauseThreshold);
 
  const handleOpenModal = () => {
    setTempThreshold(pauseThreshold);
    setIsModalOpen(true);
  };
 
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
 
  const handleSaveSettings = () => {
    setPauseThreshold(tempThreshold);
    setIsModalOpen(false);
  };
 
  const handleSliderChange = (value: number) => {
    setTempThreshold(value);
  };
 
  return (
    <>
      <Button
        type="text"
        onClick={handleOpenModal}
        className="flex items-center justify-center h-10 px-4 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
      >
        <Settings size={20} />
        <span className="ml-2 hidden md:block">{t('settings')}</span>
      </Button>
     
      <Modal
        title={
          <div className="text-center text-lg font-medium text-gray-800 dark:text-gray-200">
            {t('speechSettings.title', 'Speech Settings')}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            {t('cancel', 'Cancel')}
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white border-none">
            {t('save', 'Save')}
          </Button>
        ]}
      >
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
              {t('speechSettings.pauseThreshold', 'Pause Detection Threshold')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('speechSettings.pauseThresholdDescription',
                'Set how long (in seconds) the system should wait after you stop speaking before processing your input.')}
            </p>
           
            <div className="flex items-center">
              <div className="flex-1 mr-4">
                <Slider
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={tempThreshold}
                  onChange={handleSliderChange}
                  tooltip={{ formatter: (value) => `${value}s` }}
                />
              </div>
              <div className="w-16 text-center font-medium text-blue-600 dark:text-blue-400">
                {tempThreshold}s
              </div>
            </div>
          </div>
         
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
              {t('speechSettings.aboutInterruptions', 'About Interruptions')}
            </h4>
            <p className="text-blue-700 dark:text-blue-200 text-sm">
              {t('speechSettings.interruptionsDescription',
                'The system allows you to interrupt at any time while WinWin is speaking. Just start talking and WinWin will immediately stop to listen to you.')}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
