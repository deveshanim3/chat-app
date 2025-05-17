import React, { useState } from 'react';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react';
import './Compiler.css';

const Compiler = ({ darkMode }) => {
  const [code, setCode] = useState(`def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('python');
  const [stdin, setStdin] = useState('');
  const [version, setVersion] = useState('3.10.0');

  const languageVersionMap = {
    python: ['3.10.0'],
    javascript: ['18.15.0'],
    cpp: ['10.2.0'],
    java: ['15.0.2']
  };

  const languageMapForMonaco = {
    python: 'python',
    javascript: 'javascript',
    cpp: 'cpp',
    java: 'java'
  };

  const runCode = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/compile', {
        language,
        version,
        code,
        stdin
      });

      setOutput(res.data.run?.output || res.data.output || 'No output');
    } catch (err) {
      console.error('Compilation error:', err.response?.data || err.message);
      setOutput('Error running code');
    }
  };

  return (
    <div className={`compiler-container ${darkMode ? 'dark' : 'light'}`}>

      <select
        value={language}
        onChange={(e) => {
          const lang = e.target.value;
          setLanguage(lang);
          setVersion(languageVersionMap[lang][0]);

          // Boilerplate
          if (lang === 'python') {
            setCode(`def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`);
          } else if (lang === 'javascript') {
            setCode(`function main() {\n  console.log("Hello, World!");\n}\n\nmain();`);
          } else if (lang === 'java') {
            setCode(`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`);
          } else if (lang === 'cpp') {
            setCode(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`);
          }
        }}
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <br /><br />

      <MonacoEditor
        height="400px"
        language={languageMapForMonaco[language]}
        theme={darkMode ? 'vs-dark' : 'light'}
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: 'on'
        }}
      />

      <br /><br />
      <textarea
        rows="3"
        cols="80"
        placeholder="Input (stdin)..."
        value={stdin}
        onChange={(e) => setStdin(e.target.value)}
      />
      <br /><br />
      <button onClick={runCode}>Run Code</button>
      <h3>Output:</h3>
      <pre>{output}</pre>
    </div>
  );
};

export default Compiler;
