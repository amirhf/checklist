import React, { useState } from 'react';
import TemplateBuilder from './components/TemplateBuilder';
import ChecklistBuilder from './components/ChecklistBuilder';
//import './styles.css'; 

function App() {
  const [mode, setMode] = useState('createTemplate'); // Initial state

  return (
    <div className="app-container">
      <header>
        <h1>My Checklist App</h1>
        <nav>
          <button onClick={() => setMode('createTemplate')}>Create Template</button>
          <button onClick={() => setMode('createChecklist')}>Create Checklist</button>
        </nav>
      </header>

      <div className="mode-content">
        {mode === 'createTemplate' && <TemplateBuilder />} 
        {mode === 'createChecklist' && <ChecklistBuilder />}
      </div>
    </div>
  );
}

export default App;