# React Voice Chatbot 🎙️

A modern, multilingual voice chatbot built with React and Next.js that enables real-time voice conversations between users and an AI assistant (powered by OpenAI's GPT). This application supports multiple languages, themes, and provides an intuitive interface for voice interactions.

## Features 🚀

- Real-time voice interaction with AI
- Multi-language support (English, French, Chinese)
- Theme customization (Light/Dark mode)
- Call history tracking
- Speech settings customization
- Responsive design

## Tech Stack 💻

- **Frontend Framework:** React with Next.js
- **Styling:** Tailwind CSS
- **Testing:** Jest
- **TypeScript:** For type safety
- **i18n:** Internationalization support
- **AI Integration:** OpenAI GPT

## Getting Started 🏃‍♂️

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ishaali14/react-voice-chatbot.git
```

2. Navigate to the project directory:
```bash
cd react-voice-chatbot
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Create a `.env` file in the root directory and add your environment variables:
```env
OPENAI_API_KEY=your_api_key_here
# Add other required environment variables
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure 📁

```
├── components/           # React components
├── lib/                 # Utility functions and libraries
├── pages/              # Next.js pages
│   └── api/           # API routes
├── public/            # Static assets
│   ├── assets/       # Images and media
│   └── locales/      # Translation files
└── styles/           # Global styles
```

## Available Scripts 📝

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## Internationalization 🌐

The chatbot supports multiple languages:
- English (en-US)
- French (fr-FR)
- Chinese (zh-CN)

Language files are located in `public/locales/`.

## Features in Detail 🔍

### Voice Integration
- Real-time voice recognition
- Text-to-speech capability
- Support for multiple languages
- High-quality voice output

### Call Management
- Track call history
- Manage active calls
- Edge case handling
- Call state persistence

### User Interface
- Responsive design
- Dark/Light theme support
- Language selection dropdown
- Speech settings customization
- Intuitive controls

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 👏

- OpenAI for providing the GPT API
- Next.js team for the amazing framework
- All contributors who helped improve this project
