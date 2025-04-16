import CallWin from './CallWin';
import { Layout } from 'antd';
import LanguageManager from './LanguageManager';
import { CallHistory } from './CallHistory';
// import ConversionIdeasModal from './ConversationIdeasModal';
import CallManager from './CallManager';
import ThemeToggle from './ThemeToggle';
import SpeechSettings from './SpeechSettings';
import { ThemeProvider } from './ThemeContext';

const { Header, Content } = Layout;

export default function MainLayout() {
  return (
    <ThemeProvider>
      <Layout className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-all duration-300">
        <LanguageManager>
          <CallManager>
            <Header className="bg-white dark:bg-slate-800 shadow-md h-16 flex items-center px-6 sticky top-0 z-10 transition-all duration-300">
              <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">WinWin - The Penguin</h1>
                </div>
                <div className="flex items-center space-x-4">
                  {/* <ConversionIdeasModal /> */}
                  <CallHistory />
                  <SpeechSettings />
                  <ThemeToggle />
                </div>
              </div>
            </Header>
            <Content className="p-6 flex justify-center">
              <CallWin />
            </Content>
          </CallManager>
        </LanguageManager>
      </Layout>
    </ThemeProvider>
  );
}