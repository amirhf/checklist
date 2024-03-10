import React, { useState, useEffect, useRef } from 'react';
import { ChecklistItem } from './ChecklistItem';

// ... (You might have an interface for ChecklistItem here) ...

function ChecklistBuilder() {
  const [templates, setTemplates] = useState<Record<string, ChecklistItem[]>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [checklistVisible, setChecklistVisible] = useState(false);

  useEffect(() => {
    const storedTemplates = Object.entries(localStorage)
      .filter(([key, value]) => {
        try {
          const parsedValue = JSON.parse(value) as ChecklistItem[];
          return (
            Array.isArray(parsedValue) &&
            parsedValue.every((item) => item.hasOwnProperty("text"))
          );
        } catch (error) {
          return false;
        }
      })
      .reduce((acc, [key, value]) => {
        acc[key] = JSON.parse(value) as ChecklistItem[];
        return acc;
      }, {} as Record<string, ChecklistItem[]>);

    setTemplates(storedTemplates);
  }, []);

  const checklistRef = useRef<HTMLUListElement>(null); // Ref for the checklist <ul>

  const handleResetChecklist = () => {
    if (checklistRef.current) {
      const checkboxes = checklistRef.current.querySelectorAll('input[type="checkbox"]'); 
      checkboxes.forEach((checkbox) => {
        (checkbox as HTMLInputElement).checked = false;
      });
    }
  };


  const handleTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(event.target.value); 
    setChecklistVisible(false); // Hide checklist initially on template change
  };

  const handleCreateChecklist = () => {
    setChecklistVisible(true);
  };
  const renderChecklistItem = (item: ChecklistItem) => {
    const parts = item.text.split('\\t');

    return (
      <li key={item.text}> 
        <input type="checkbox" />
        {parts.map((part, index) => (
          <React.Fragment key={index}> 
            {part ? part : <input type="text" />} 
          </React.Fragment>
        ))}
      </li>
    );
  };
  return (
    <div>
      <h2>Checklist Builder</h2>

      <div>
        <label htmlFor="template-select">Select Template:</label>
        <select id="template-select" value={selectedTemplate || ''} onChange={handleTemplateChange}> 
          <option value="">-- Select --</option>
          {Object.keys(templates).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <button onClick={handleCreateChecklist} disabled={!selectedTemplate}>Create Checklist</button>

      {checklistVisible && selectedTemplate && (
        <div className="checklist"> 
          <h3>Checklist: {selectedTemplate}</h3>
          <ul ref={checklistRef}> 
            {templates[selectedTemplate].map(renderChecklistItem)} 
          </ul>
          <button onClick={handleResetChecklist}>Reset</button> 
        </div>
      )}       
    </div>
  );
}

export default ChecklistBuilder;
