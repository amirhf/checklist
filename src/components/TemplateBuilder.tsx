import React, { useState } from 'react';

interface ChecklistItem {
  text: string; 
}

function TemplateBuilder() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]); 
  const [newItemText, setNewItemText] = useState(''); 
  const [editingIndex, setEditingIndex] = useState<number | null>(null); 
  const [editText, setEditText] = useState(''); 

  const handleAddItem = () => {
    if (newItemText.trim()) { 
      setChecklistItems([...checklistItems, { text: newItemText }]);
      setNewItemText(''); 
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
      setEditText('');
    }
  };

  const handleDelete = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Template Builder</h2>

      <div className="input-area">
        <input 
          type="text" 
          value={newItemText} 
          onChange={handleInputChange}
          placeholder="Enter checklist item" 
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <h3>Checklist Preview:</h3>
      <ul>
        {checklistItems.map((item, index) => (
          <li key={index}> 
            {editingIndex === index ? (
              <>
                <input type="text" value={editText} onChange={handleEditChange} />
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
