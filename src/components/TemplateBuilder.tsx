import React, { useEffect, useState } from "react";
import { ChecklistItem } from "./ChecklistItem";

function TemplateBuilder() {
  const [templates, setTemplates] = useState<Record<string, ChecklistItem[]>>(
    {}
  ); // For loading templates
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null); // Selected for editing
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]); // Items of the selected template
  const [newItemText, setNewItemText] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [newTemplateMode, setNewTemplateMode] = useState(false);

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
  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTemplate(event.target.value);
  };

  const handleDeleteTemplate = () => {
    if (selectedTemplate) {
      localStorage.removeItem(selectedTemplate);
      setTemplates(
        Object.fromEntries(
          Object.entries(localStorage).filter(
            ([key]) => key !== selectedTemplate
          )
        )
      );
      setSelectedTemplate(null);
      alert("Template deleted!");
    } else {
      alert("Please select a template to delete!");
    }
  };
  // Load checklist items of selected template for editing
  useEffect(() => {
    if (selectedTemplate) {
      setChecklistItems(templates[selectedTemplate]);
    } else {
      setChecklistItems([]); // Reset when no template is selected
    }
  }, [selectedTemplate, templates]);

  const handleAddItem = () => {
    if (newItemText.trim()) {
      setChecklistItems([...checklistItems, { text: newItemText }]);
      setNewItemText("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItemText(event.target.value);
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditText(checklistItems[index].text);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedItems = [...checklistItems];
      updatedItems[editingIndex].text = editText;
      setChecklistItems(updatedItems);
      setEditingIndex(null);
      setEditText("");
    }
  };

  const handleDelete = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };
  const handleNewTemplate = () => {
    setNewTemplateMode(true);
    setChecklistItems([]); // Clear checklist items for a new template
    setSelectedTemplate(null); // Deselect any existing template
  };

  const handleSaveTemplate = () => {
    if (newTemplateMode) {
      handleSaveAsTemplate(); // Treat it as Save As if it's a new template
    } else if (selectedTemplate) {
      localStorage.setItem(selectedTemplate, JSON.stringify(checklistItems));
      alert("Template saved successfully!");
    } else {
      alert("Please select a template to save!");
    }
  };

  const handleSaveAsTemplate = () => {
    const templateName = prompt("Enter a name for your template:");
    if (templateName) {
      localStorage.setItem(templateName, JSON.stringify(checklistItems));
      setTemplates({ ...templates, [templateName]: checklistItems }); // Update templates state
      setNewTemplateMode(false); // Exit new template mode
      alert("Template saved successfully!");
    }
  };
  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          // Assuming valid checklist format
          const templateName = file.name.split('.').slice(0, -1).join('.'); // Extract name from filename
          setTemplates({ ...templates, [templateName]: importedData });
          setSelectedTemplate(templateName);
          alert('Template imported successfully!');
        } catch (error) {
          console.error('Error importing template:', error);
          alert('Invalid file format or file contents.');
        }
      };
      reader.readAsText(file);
    }
  };
  const handleExportTemplate = () => {
    if (selectedTemplate) {
      const data = JSON.stringify(templates[selectedTemplate]); 
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedTemplate}.json`;
      link.click();
      alert('Template Exported Successfully!');
    } else {
      alert('Please select a template to export!');
    }
  };
  return (
    <div>
      <h2>Template Builder</h2>
      <button onClick={handleNewTemplate}>New Template</button>
      <div>
        <label htmlFor="template-select">Select Template:</label>
        <select
          id="template-select"
          value={selectedTemplate || ""}
          onChange={handleTemplateChange}
        >
          <option value="">-- Select --</option>
          {Object.keys(templates).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="input-area">
        <input
          type="text"
          value={newItemText}
          onChange={handleInputChange}
          placeholder="Enter checklist item"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <button onClick={handleSaveTemplate}>Save</button>
      <button onClick={handleSaveAsTemplate}>Save As</button>
      <button onClick={handleDeleteTemplate}>Delete Template</button>
      <input type="file" accept=".json" onChange={handleImportTemplate} /> 
      <button onClick={handleExportTemplate}>Export Template</button>
      <h3>Checklist Preview:</h3>
      <ul>
        {checklistItems.map((item, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={handleEditChange}
                />
                <button onClick={handleSaveEdit}>Save</button>
              </>
            ) : (
              <>
                {item.text}
                <button onClick={() => handleEditClick(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TemplateBuilder;
