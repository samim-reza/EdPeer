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
const [userInput, setUserInput] = useState('');
const [awaitingInput, setAwaitingInput] = useState(false);
const [inputPrompt, setInputPrompt] = useState('');
const userInputRef = useRef(null);

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
    setCode("// Write your code here\nfunction example() {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve('Done!'), 1000);\n  });\n}\n\n// Example of getting user input\nconst name = prompt('What is your name?');\nconsole.log(`Hello, ${name}!`);\n\n// Call the function\nexample().then(console.log);\nconsole.log('Hello from JavaScript!');");
  } else if (language === 'python') {
    setCode("# Write your code here\nname = input('What is your name? ')\nprint(f'Hello, {name}!')\nprint('Hello from Python!')");
  } else if (language === 'cpp') {
    setCode("#include <iostream>\n#include <string>\n\nint main() {\n  std::string name;\n  std::cout << \"What is your name? \";\n  std::cin >> name;\n  std::cout << \"Hello, \" << name << \"!\" << std::endl;\n  std::cout << \"Hello from C++!\" << std::endl;\n  return 0;\n}");
  }
}, [language]);

// Focus on input field when awaiting input
useEffect(() => {
  if (awaitingInput && userInputRef.current) {
    userInputRef.current.focus();
  }
}, [awaitingInput]);

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

const handleUserInputSubmit = (e) => {
  e.preventDefault();
  if (userInput.trim()) {
    setCodeOutput(prev => `${prev}\n> ${userInput}`);
    setAwaitingInput(false);
    
    // Send the input to the appropriate execution context
    if (language === 'javascript') {
      window.codeInputResolve(userInput);
    } else {
      // For simulated executions
      simulateCodeContinuation(userInput);
    }
    
    setUserInput('');
  }
};

const simulateCodeContinuation = (input) => {
  if (language === 'python') {
    // Continue Python execution with the provided input
    if (inputPrompt.includes('name')) {
      setCodeOutput(prev => `${prev}\nHello, ${input}!\nHello from Python!`);
    }
  } else if (language === 'cpp') {
    // Continue C++ execution with the provided input
    if (inputPrompt.includes('name')) {
      setCodeOutput(prev => `${prev}\nHello, ${input}!\nHello from C++!`);
    }
  }
};

const runCode = () => {
  setCodeOutput('');
  
  if (language === 'javascript') {
    runJavaScriptCode();
  } else if (language === 'python') {
    runPythonCode();
  } else if (language === 'cpp') {
    runCppCode();
  }
};

const runJavaScriptCode = () => {
  try {
    // Create a safe environment to run JS code
    const originalConsoleLog = console.log;
    const originalPrompt = window.prompt;
    let output = [];

    // Override console.log to capture output
    console.log = (...args) => {
      output.push(args.map(arg => String(arg)).join(' '));
      setCodeOutput(prev => `${prev}${prev ? '\n' : ''}${args.map(arg => String(arg)).join(' ')}`);
      originalConsoleLog(...args);
    };

    // Override prompt to get user input
    window.prompt = (message) => {
      return new Promise(resolve => {
        window.codeInputResolve = resolve;
        setInputPrompt(message || 'Enter input:');
        setAwaitingInput(true);
        setCodeOutput(prev => `${prev}${prev ? '\n' : ''}${message || 'Enter input:'}`);
      });
    };

    // Wrap the code to handle async operations properly
    const wrappedCode = `
      (async function() {
        try {
          ${code}
        } catch (error) {
          console.log('Error:', error.message);
        }
      })();
    `;

    // Execute the code
    eval(wrappedCode);

    // Restore original functions (important for cleanup)
    setTimeout(() => {
      console.log = originalConsoleLog;
      window.prompt = originalPrompt;
    }, 100);
  } catch (err) {
    setCodeOutput(`Error: ${err.message}`);
  }
};

const runPythonCode = () => {
  setCodeOutput("Executing Python code...");
  
  // Simple Python interpreter simulation
  try {
    const lines = code.split('\n');
    let lineIndex = 0;
    
    const processNextLine = () => {
      if (lineIndex >= lines.length) return;
      
      const line = lines[lineIndex++].trim();
      
      // Handle input function
      if (line.includes('input(')) {
        const promptMatch = line.match(/input\s*\(\s*(?:["'](.+?)["'])?\s*\)/);
        const promptText = promptMatch && promptMatch[1] ? promptMatch[1] : 'Enter input:';
        
        // Extract variable name
        const varName = line.split('=')[0].trim();
        
        // Show prompt and wait for input
        setInputPrompt(promptText);
        setAwaitingInput(true);
        setCodeOutput(prev => `${prev}\n${promptText}`);
        
        // The actual processing will continue when handleUserInputSubmit is called
      }
      // Handle print function
      else if (line.includes('print(')) {
        const printMatch = line.match(/print\s*\(\s*(?:[fF]?["'](.+?)["'])?\s*\)/);
        if (printMatch && printMatch[1]) {
          let output = printMatch[1];
          
          // Simple f-string simulation
          if (line.includes('f\'') || line.includes('f"')) {
            // Replace {name} with "user input" for simulation
            output = output.replace(/\{(\w+)\}/g, '{user input}');
          }
          
          setCodeOutput(prev => `${prev}\n${output}`);
        }
        
        setTimeout(processNextLine, 100);
      } else {
        // Skip other lines in this simulation
        setTimeout(processNextLine, 10);
      }
    };
    
    processNextLine();
  } catch (err) {
    setCodeOutput(prev => `${prev}\nError: ${err.message}`);
  }
};

const runCppCode = () => {
  setCodeOutput("Compiling and running C++ code...");
  
  // Simulate C++ execution with user input
  try {
    if (code.includes('std::cin')) {
      // Find the prompt if it exists
      const promptMatch = code.match(/std::cout\s*<<\s*["'](.+?)["']/);
      const promptText = promptMatch && promptMatch[1] ? promptMatch[1] : 'Enter input:';
      
      // Show prompt and wait for user input
      setInputPrompt(promptText);
      setAwaitingInput(true);
      setCodeOutput(`${promptText}`);
    } else {
      // If no input needed, just show output from cout statements
      const coutMatches = code.match(/std::cout\s*<<\s*["'](.+?)["']/g) || [];
      const outputs = coutMatches.map(match => {
        const content = match.match(/["'](.+?)["']/)?.[1] || '';
        return content;
      });
      
      setCodeOutput(outputs.join('\n') || "No output");
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
      );
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
                  options={{ 
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true
                  }}
                />
              </div>
              <div className="h-1/3 border-t border-gray-700 p-2 bg-gray-900 overflow-auto">
                <div className="p-2 bg-gray-800 h-full rounded overflow-auto flex flex-col">
                  <div className="flex-1 overflow-auto">
                    <pre className="text-white font-mono text-sm">{codeOutput || 'Output will appear here after running the code'}</pre>
                  </div>
                  {awaitingInput && (
                    <form onSubmit={handleUserInputSubmit} className="mt-2 flex gap-2">
                      <input
                        ref={userInputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter your input..."
                        className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                      />
                      <button type="submit" className="bg-blue-600 px-3 py-2 rounded">
                        Submit
                      </button>
                    </form>
                  )}
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