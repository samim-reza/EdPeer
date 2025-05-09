import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSignOutAlt, faPlay, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function LearningSession() {
  const [messages, setMessages] = useState([
    { user: 'Tutor', text: 'Let\'s start by looking at the promise syntax', isSystem: false },
    { user: 'You', text: 'Got it, I\'ve opened the code editor', isUser: true }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000');
  const [currentTool, setCurrentTool] = useState('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { user: 'You', text: newMessage, isUser: true }]);
      setNewMessage('');
    }
  };

  // Canvas drawing functions would go here...

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          <span className="text-lg">JavaScript Promises</span>
          <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">45:00</span>
        </div>
        <div className="flex gap-4">
          <button className="bg-blue-600 px-4 py-2 rounded flex items-center gap-2">
            <FontAwesomeIcon icon={faDownload} /> Export Session
          </button>
          <button className="bg-red-600 px-4 py-2 rounded flex items-center gap-2">
            <FontAwesomeIcon icon={faSignOutAlt} /> Leave Session
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="w-1/4 border-r border-gray-700 flex flex-col">
          <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
            <select className="bg-gray-700 text-white px-3 py-2 rounded">
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
            </select>
            <button className="bg-blue-600 px-4 py-2 rounded flex items-center gap-2">
              <FontAwesomeIcon icon={faPlay} /> Run Code
            </button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              defaultValue="// Write your code here\nfunction example() {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve('Done!'), 1000);\n  });\n}"
              theme="vs-dark"
              options={{ minimap: { enabled: false } }}
            />
          </div>
        </div>

        {/* Whiteboard */}
        <div className="flex-1 border-r border-gray-700 flex flex-col">
          <div className="bg-gray-800 p-4 flex items-center gap-4 border-b border-gray-700">
            <div className="flex gap-2">
              <button 
                className={`w-10 h-10 rounded ${currentTool === 'pen' ? 'border-blue-500' : 'border-gray-600'} border-2`}
                onClick={() => setCurrentTool('pen')}
              >
                <FontAwesomeIcon icon="pencil-alt" />
              </button>
              <button 
                className={`w-10 h-10 rounded ${currentTool === 'eraser' ? 'border-blue-500' : 'border-gray-600'} border-2`}
                onClick={() => setCurrentTool('eraser')}
              >
                <FontAwesomeIcon icon="eraser" />
              </button>
            </div>
            <div className="flex gap-2">
              {['#000', '#dc2626', '#2563eb', '#16a34a'].map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full ${currentColor === color ? 'border-2 border-white' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>
            <button className="bg-blue-600 px-4 py-2 rounded flex items-center gap-2">
              <FontAwesomeIcon icon={faTrash} /> Clear
            </button>
          </div>
          <canvas 
            ref={canvasRef}
            className="flex-1 bg-white cursor-crosshair"
          />
        </div>

        {/* Chat */}
        <div className="w-1/4 flex flex-col">
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <h3 className="text-lg">Session Chat</h3>
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-800 p-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg mb-4 ${message.isUser ? 'bg-blue-600 ml-auto' : 'bg-gray-700'} ${message.isSystem ? 'text-center text-gray-400' : ''}`}
              >
                <strong>{message.user}:</strong> {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="bg-gray-800 p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded"
              />
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}