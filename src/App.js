import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Plus, Download, FileJson } from 'lucide-react';

const ITEM_TYPES = {
  TEXT_HINT: 'Hinweistext',
  INPUT_PLZ: 'Postleitzahl Eingabe',
  RADIO: 'Radio Button',
  INPUT_TEXT: 'Text Eingabe',
  INPUT_NUMBER: 'Nummer Eingabe'
};

const JSONGenerator = () => {
  const [formData, setFormData] = useState({
    id: 1,
    name: '',
    serviceId: 1,
    steps: []
  });

  const [jsonPreview, setJsonPreview] = useState('');

  const updateJsonPreview = useCallback(() => {
    setJsonPreview(JSON.stringify(formData, null, 2));
  }, [formData]);

  useEffect(() => {
    updateJsonPreview();
  }, [updateJsonPreview]);

  const updateBasicInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'name' ? value : parseInt(value) || 1
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, {
        title: '',
        order: prev.steps.length + 1,
        items: []
      }]
    }));
  };

  const removeStep = (stepIndex) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, index) => index !== stepIndex)
    }));
  };

  const updateStep = (stepIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex 
          ? { ...step, [field]: field === 'order' ? parseInt(value) || 1 : value }
          : step
      )
    }));
  };

  const addItem = (stepIndex) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex 
          ? { ...step, items: [...step.items, { type: 'TEXT_HINT', text: '', label: '' }] }
          : step
      )
    }));
  };

  const removeItem = (stepIndex, itemIndex) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex 
          ? { ...step, items: step.items.filter((_, idx) => idx !== itemIndex) }
          : step
      )
    }));
  };

  const updateItem = (stepIndex, itemIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, sIndex) => 
        sIndex === stepIndex 
          ? {
              ...step,
              items: step.items.map((item, iIndex) => 
                iIndex === itemIndex 
                  ? { ...item, [field]: value }
                  : item
              )
            }
          : step
      )
    }));
  };

  const downloadJson = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'anfrage.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">JSON Generator für Anfragen</h1>
        <p className="text-gray-600 mb-6">Erstellen Sie hier Ihre Anfrage-Formulare im JSON-Format.</p>

        {/* Basic Info */}
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Grundinformationen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ID:</label>
              <input
                type="number"
                value={formData.id}
                onChange={(e) => updateBasicInfo('id', e.target.value)}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service ID:</label>
              <input
                type="number"
                value={formData.serviceId}
                onChange={(e) => updateBasicInfo('serviceId', e.target.value)}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateBasicInfo('name', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Schritte</h2>
            <button
              onClick={addStep}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Plus size={16} /> Schritt hinzufügen
            </button>
          </div>

          {formData.steps.map((step, stepIndex) => (
            <div key={stepIndex} className="mb-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Schritt {stepIndex + 1}</h3>
                <button
                  onClick={() => removeStep(stepIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titel:</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(stepIndex, 'title', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reihenfolge:</label>
                  <input
                    type="number"
                    value={step.order}
                    onChange={(e) => updateStep(stepIndex, 'order', e.target.value)}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Items</h4>
                  <button
                    onClick={() => addItem(stepIndex)}
                    className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    <Plus size={16} /> Item hinzufügen
                  </button>
                </div>

                {step.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-4 items-start mb-2 p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <select
                        value={item.type}
                        onChange={(e) => updateItem(stepIndex, itemIndex, 'type', e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                      >
                        {Object.entries(ITEM_TYPES).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={item.type === 'TEXT_HINT' ? item.text : item.label || ''}
                        onChange={(e) => updateItem(stepIndex, itemIndex, item.type === 'TEXT_HINT' ? 'text' : 'label', e.target.value)}
                        placeholder={item.type === 'TEXT_HINT' ? 'Text' : 'Label'}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <button
                      onClick={() => removeItem(stepIndex, itemIndex)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* JSON Preview */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileJson size={24} />
              JSON Vorschau
            </h2>
            <button
              onClick={downloadJson}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              <Download size={16} /> JSON herunterladen
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {jsonPreview}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JSONGenerator;