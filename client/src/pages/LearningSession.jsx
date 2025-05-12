import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, faSignOutAlt, faPlay, faTrash, faPaperPlane, 
  faPencilAlt, faEraser, faCode, faComments, faPaintBrush
} from '@fortawesome/free-solid-svg-icons';

export default function LearningSession() {
  const [messages, setMessages] = useState([
    { user: 'Tutor', text: 'Let\'s start by looking at the promise syntax', isSystem: false },
    { user: 'You', text: 'Got it, I\'ve opened the code editor', isUser: true }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [currentColor, setCurrentColor] = useState('#000');
  const [currentTool, setCurrentTool] = useState('pen');
  const [brushSize, setBrushSize] = useState(5);
  const [code, setCode] = useState("// Write your code here\nfunction example() {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve('Done!'), 1000);\n  });\n}");
  const [codeOutput, setCodeOutput] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [activeTab]);

  // Update default code when language changes
  useEffect(() => {
    if (language === 'javascript') {
      setCode("// Write your code here\nfunction example() {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve('Done!'), 1000);\n  });\n}\n\n// Call the function\nexample().then(console.log);\nconsole.log('Hello from JavaScript!');");
    } else if (language === 'python') {
      setCode("# Write your code here\nprint('Hello from Python!')");
    } else if (language === 'cpp') {
      setCode("#include <iostream>\n\nint main() {\n  std::cout << \"Hello from C++!\" << std::endl;\n  return 0;\n}");
    }
  }, [language]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDrawing(true);
    setLastPosition({ x, y });
  };

  const draw = (e) => {
    if (!drawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    setLastPosition({ x, y });
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { user: 'You', text: newMessage, isUser: true }]);
      setNewMessage('');
    }
  };

  const runCode = () => {
    try {
      if (language === 'javascript') {
        // Create a safe environment to run the code
        const originalConsoleLog = console.log;
        let output = [];

        // Override console.log to capture output
        console.log = (...args) => {
          output.push(args.map(arg => String(arg)).join(' '));
          originalConsoleLog(...args);
        };

        // Run the code
        const result = new Function(code)();
        
        // If the result is a promise, handle it
        if (result && typeof result.then === 'function') {
          result
            .then(res => {
              if (res !== undefined) output.push(`Promise resolved: ${res}`);
              setCodeOutput(output.join('\n'));
            })
            .catch(err => {
              output.push(`Error: ${err.message}`);
              setCodeOutput(output.join('\n'));
            });
        } else {
          // Handle regular return values
          if (result !== undefined) output.push(`Return value: ${result}`);
          setCodeOutput(output.join('\n'));
        }

        // Restore original console.log
        console.log = originalConsoleLog;
      } else if (language === 'python') {
        // Simulate Python execution (in a real app, you'd use a server or WASM)
        setCodeOutput("Executing Python code...\n");
        
        // Simulate Python output based on the code content
        if (code.includes('print(')) {
          // Extract content from print statements (simplified)
          const printMatches = code.match(/print\s*\(\s*["'](.+?)["']\s*\)/g) || [];
          const outputs = printMatches.map(match => {
            const content = match.match(/["'](.+?)["']/)?.[1] || '';
            return content;
          });
          
          setCodeOutput(outputs.join('\n') || "No output");
        } else {
          setCodeOutput("No output");
        }
      } else if (language === 'cpp') {
        // Simulate C++ execution
        setCodeOutput("Compiling C++ code...\n");
        
        // Simulate output from cout statements (simplified)
        if (code.includes('cout')) {
          const coutMatches = code.match(/cout\s*<<\s*["'](.+?)["']/g) || [];
          const outputs = coutMatches.map(match => {
            const content = match.match(/["'](.+?)["']/)?.[1] || '';
            return content;
          });
          
          setCodeOutput(outputs.join('\n') || "No output");
        } else {
          setCodeOutput("No output");
        }
      }
    } catch (err) {
      setCodeOutput(`Error: ${err.message}`);
    }
  };

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
        {/* Sidebar */}
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4">
          <button 
            className={`p-3 rounded-lg mb-4 ${activeTab === 'editor' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setActiveTab('editor')}
            title="Code Editor"
          >
            <FontAwesomeIcon icon={faCode} size="lg" />
          </button>
          <button 
            className={`p-3 rounded-lg mb-4 ${activeTab === 'whiteboard' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setActiveTab('whiteboard')}
            title="Whiteboard"
          >
            <FontAwesomeIcon icon={faPaintBrush} size="lg" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Code Editor Panel */}
          {activeTab === 'editor' && (
            <div className="flex flex-col h-full">
              <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
                <select 
                  className="bg-gray-700 text-white px-3 py-2 rounded"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
                <button 
                  className="bg-blue-600 px-4 py-2 rounded flex items-center gap-2"
                  onClick={runCode}
                >
                  <FontAwesomeIcon icon={faPlay} /> Run Code
                </button>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="h-2/3">
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={setCode}
                    theme="vs-dark"
                    options={{ minimap: { enabled: false } }}
                  />
                </div>
                <div className="h-1/3 border-t border-gray-700 p-2 bg-gray-900 overflow-auto">
                  <div className="p-2 bg-gray-800 h-full rounded overflow-auto">
                    <pre className="text-white font-mono text-sm">{codeOutput || 'Output will appear here after running the code'}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Whiteboard Panel */}
          {activeTab === 'whiteboard' && (
            <div className="flex flex-col h-full">
              <div className="bg-gray-800 p-4 flex items-center gap-4 border-b border-gray-700 flex-wrap">
                <div className="flex gap-2">
                  <button 
                    className={`w-10 h-10 rounded flex items-center justify-center ${currentTool === 'pen' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    onClick={() => setCurrentTool('pen')}
                    title="Pen"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button 
                    className={`w-10 h-10 rounded flex items-center justify-center ${currentTool === 'eraser' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    onClick={() => setCurrentTool('eraser')}
                    title="Eraser"
                  >
                    <FontAwesomeIcon icon={faEraser} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Size:</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={brushSize} 
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-32"
                  />
                  <span className="bg-gray-700 px-2 py-1 rounded text-sm">{brushSize}px</span>
                </div>
                <div className="flex gap-2 ml-4">
                  {['#000', '#dc2626', '#2563eb', '#16a34a', '#eab308', '#ffffff'].map(color => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full ${currentColor === color ? 'ring-2 ring-white' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setCurrentColor(color);
                        if (color === '#ffffff') setCurrentTool('eraser');
                        else setCurrentTool('pen');
                      }}
                    />
                  ))}
                </div>
                <button 
                  className="bg-blue-600 px-4 py-2 rounded flex items-center gap-2 ml-auto"
                  onClick={clearCanvas}
                >
                  <FontAwesomeIcon icon={faTrash} /> Clear
                </button>
              </div>
              <div className="flex-1 bg-white relative">
                <canvas 
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            </div>
          )}

          {/* Chat Panel */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="bg-gray-800 p-4 border-b border-gray-700">
                <h3 className="text-lg">Session Chat</h3>
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg mb-4 max-w-[80%] ${
                      message.isUser 
                        ? 'bg-blue-600 ml-auto' 
                        : message.isSystem 
                          ? 'bg-gray-800 mx-auto text-gray-400' 
                          : 'bg-gray-700'
                    }`}
                  >
                    {!message.isSystem && <strong>{message.user}:</strong>} {message.text}
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
          )}
        </div>
        
        {/* Always visible chat sidebar */}
        <div className="w-1/4 border-l border-gray-700 flex flex-col">
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