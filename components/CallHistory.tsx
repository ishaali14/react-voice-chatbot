import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Layout, Menu } from 'antd';
import { useTranslation } from 'next-i18next';
import { MessageType } from './CallManager';
import { useTheme } from './ThemeContext';


const { Sider } = Layout;


export interface CallHistoryType {
  date: string;
  messages: MessageType[];
}


export function CallHistory() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [callHistories, setCallHistories] = useState<CallHistoryType[]>([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [showHistoryLayout, setShowHistoryLayout] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();


  useEffect(() => {
    const useCallHistories: CallHistoryType[] = localStorage.getItem('callHistory')
      ? JSON.parse(localStorage.getItem('callHistory') as string)
      : [];
    setCallHistories(useCallHistories);
    setShowHistoryLayout(false);
  }, [open]);


  useEffect(() => {
    setSelectedKey(callHistories[callHistories.length - 1]?.date);
  }, [callHistories]);


  // Scroll to bottom of sidebar and messages when they change
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
    }
  }, [callHistories]);


  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [selectedKey]);


  const handleSidebarClick = (key: string) => {
    setSelectedKey(key);
    setShowHistoryLayout(true);
  };


  const handleBackClick = () => {
    setShowHistoryLayout(false);
  };


  const items = callHistories.map(history => ({
    key: history.date,
    label: history.date,
  }));


  const noHistoryDom = (
    <div className="h-full flex justify-center items-center text-gray-500 dark:text-gray-400">
      {t('callHistory.modal.noHistoryMessage')}
    </div>
  );


  return (
    <>
      <Button
        type="text"
        className="flex items-center justify-center h-10 px-4 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        onClick={() => setOpen(true)}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span className="hidden md:block">{t('callHistory')}</span>
      </Button>
     
      <Modal
        title={
          <div className="text-center text-lg font-medium text-gray-800 dark:text-gray-200">
            {t('callHistory.modal.title')}
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
        className="rounded-lg"
        bodyStyle={{ padding: 0, height: 600 }}
      >
        <Layout hasSider className="h-full rounded-b-lg overflow-hidden">
          <Sider
            className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
              showHistoryLayout ? 'hidden md:block' : 'block'
            } transition-colors duration-300`}
            width={250}
            theme={theme === 'dark' ? 'dark' : 'light'}
          >
            <div ref={sidebarRef} className="h-full overflow-auto custom-scrollbar">
              <Menu
                items={items}
                onClick={item => handleSidebarClick(item.key)}
                selectedKeys={[selectedKey]}
                className="border-0 bg-white dark:bg-gray-800 dark:text-gray-200"
                theme={theme === 'dark' ? 'dark' : 'light'}
              />
              <div className="p-4 flex justify-center">
                <Button
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  type="link"
                  onClick={() => {
                    if (sidebarRef.current) {
                      sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                  <span className="ml-1">{t('scrollDown')}</span>
                </Button>
              </div>
            </div>
          </Sider>
         
          <Layout className={`w-full ${showHistoryLayout ? 'block' : 'hidden md:block'} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
            <div className="p-4">
              {showHistoryLayout && (
                <button
                  onClick={handleBackClick}
                  className="md:hidden flex items-center text-gray-600 dark:text-gray-400 mb-4"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Back
                </button>
              )}
             
              <div ref={messagesRef} className="overflow-y-auto h-[calc(600px-32px)] rounded-lg custom-scrollbar">
                {selectedKey && callHistories.length > 0
                  ? callHistories
                      .find(history => history.date === selectedKey)
                      ?.messages.map((message, index) => (
                        <div
                          key={index}
                          className={`p-4 mb-2 rounded-lg ${
                            message.sender !== 'user'
                              ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50'
                              : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                          } transition-colors duration-300`}
                        >
                          <div className="flex items-start">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                              message.sender !== 'user' ? 'bg-blue-500 dark:bg-blue-600' : 'bg-gray-500 dark:bg-gray-600'
                            }`}>
                              {message.sender === 'user' ? (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                                </svg>
                              )}
                            </div>
                            <div className="text-gray-800 dark:text-gray-200">{message.message}</div>
                          </div>
                        </div>
                      ))
                  : noHistoryDom}
              </div>
             
              <div className="pt-4 flex justify-center">
                <Button
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  type="link"
                  onClick={() => {
                    if (messagesRef.current) {
                      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                  <span className="ml-1">{t('scrollDown')}</span>
                </Button>
              </div>
            </div>
          </Layout>
        </Layout>
      </Modal>
    </>
  );
}
