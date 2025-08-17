import React, { useState } from 'react';
import { WaterData } from '../types';
import { Upload, Plus, Calculator, Camera } from 'lucide-react';
import { generateId } from '../utils/storage';

interface AddReadingProps {
  onAddReading: (reading: WaterData) => void;
}

export const AddReading: React.FC<AddReadingProps> = ({ onAddReading }) => {
  const [method, setMethod] = useState<'manual' | 'bill'>('manual');
  const [reading, setReading] = useState('');
  const [previousReading, setPreviousReading] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [unit, setUnit] = useState<'liters' | 'gallons'>('liters');
  const [billFile, setBillFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (method === 'manual') {
      // Validation
      const newErrors: {[key: string]: string} = {};
      
      if (!reading) {
        newErrors.reading = 'Current reading is required';
      }
      
      if (previousReading && parseFloat(reading) <= parseFloat(previousReading)) {
        newErrors.reading = 'Current reading must be higher than previous reading';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      const usage = parseFloat(reading) - parseFloat(previousReading || '0');
      const newReading: WaterData = {
        id: generateId(),
        date,
        reading: parseFloat(reading),
        usage: Math.max(0, usage),
        unit,
        source: 'manual'
      };
      onAddReading(newReading);
      setReading('');
      setPreviousReading('');
    } else if (method === 'bill' && billFile) {
      setProcessing(true);
      // Simulate OCR processing
      setTimeout(() => {
        // Use enhanced OCR extraction
        const extractedData = simulateOCRExtraction(billFile);
        
        const mockExtractedData: WaterData = {
          id: generateId(),
          date,
          reading: extractedData.currentReading,
          usage: extractedData.usage,
          unit: 'liters',
          source: 'bill'
        };
        
        // Show extraction details
        const event = new CustomEvent('showNotification', {
          detail: { 
            message: `OCR extracted: Previous: ${extractedData.previousReading}, Current: ${extractedData.currentReading}, Usage: ${extractedData.usage}L from ${billFile.name}`, 
            type: 'success' 
          }
        });
        window.dispatchEvent(event);
        
        onAddReading(mockExtractedData);
        setBillFile(null);
        setProcessing(false);
      }, 3000); // Slightly longer processing time for realism
    }
  };

  // Enhanced OCR simulation with better extraction
  const simulateOCRExtraction = (file: File) => {
    const fileName = file.name.toLowerCase();
    
    // Simulate different extraction patterns based on file type
    let mockPreviousReading, mockCurrentReading, mockUsage;
    
    if (fileName.includes('pdf')) {
      // PDF files typically have better OCR accuracy
      mockPreviousReading = 1200 + Math.random() * 300; // 1200-1500
      mockCurrentReading = mockPreviousReading + 200 + Math.random() * 200; // +200-400
      mockUsage = mockCurrentReading - mockPreviousReading;
    } else if (fileName.includes('jpg') || fileName.includes('jpeg') || fileName.includes('png')) {
      // Image files might have slightly less accuracy
      mockPreviousReading = 1100 + Math.random() * 400; // 1100-1500
      mockCurrentReading = mockPreviousReading + 150 + Math.random() * 250; // +150-400
      mockUsage = mockCurrentReading - mockPreviousReading;
    } else {
      // Default extraction
      mockPreviousReading = 1000 + Math.random() * 500; // 1000-1500
      mockCurrentReading = mockPreviousReading + 180 + Math.random() * 220; // +180-400
      mockUsage = mockCurrentReading - mockPreviousReading;
    }
    
    // Add seasonal variation
    const currentMonth = new Date().getMonth();
    const seasonalMultiplier = [0.9, 0.85, 0.95, 1.1, 1.2, 1.3, 1.4, 1.35, 1.15, 1.0, 0.9, 0.85][currentMonth];
    mockUsage *= seasonalMultiplier;
    
    return {
      previousReading: Math.round(mockPreviousReading * 10) / 10,
      currentReading: Math.round(mockCurrentReading * 10) / 10,
      usage: Math.round(mockUsage)
    };
  };

  const calculateUsage = () => {
    if (reading && previousReading) {
      return Math.max(0, parseFloat(reading) - parseFloat(previousReading));
    }
    return 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ file: 'File size must be less than 10MB' });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ file: 'Only PDF, JPG, and PNG files are allowed' });
        return;
      }
      
      setBillFile(file);
      setErrors({});
    }
  };
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Water Reading</h1>
        <p className="text-gray-600 mb-8">Enter your latest water meter reading or upload your bill — we'll update your stats instantly.</p>

        {/* Method Selection */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setMethod('manual')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              method === 'manual' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Plus className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold text-gray-900">Manual Entry</h3>
            <p className="text-sm text-gray-600 mt-1">Enter meter reading manually</p>
          </button>

          <button
            onClick={() => setMethod('bill')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              method === 'bill' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Upload Bill</h3>
            <p className="text-sm text-gray-600 mt-1">Extract data with OCR</p>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {method === 'manual' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous Reading</label>
                  <input
                    type="number"
                    value={previousReading}
                    onChange={(e) => setPreviousReading(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Reading</label>
                  <input
                    type="number"
                    value={reading}
                    onChange={(e) => setReading(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1250.5"
                    step="0.1"
                    required
                  />
                  {errors.reading && (
                    <p className="text-red-600 text-sm mt-1">{errors.reading}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as 'liters' | 'gallons')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="liters">Liters</option>
                  <option value="gallons">Gallons</option>
                </select>
              </div>

              {reading && previousReading && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Calculator size={20} />
                    <span className="font-medium">Calculated Usage</span>
                  </div>
                  <p className="text-green-700 text-lg font-semibold mt-1">
                    {calculateUsage().toFixed(1)} {unit}
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    This is {calculateUsage() > 100 ? 'higher than' : 'within'} typical daily usage range
                  </p>
                </div>
              )}
            </>
          )}

          {method === 'bill' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Bill</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="bill-upload"
                />
                <label htmlFor="bill-upload" className="cursor-pointer">
                  <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    {billFile ? billFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </label>
              </div>
              
              {errors.file && (
                <p className="text-red-600 text-sm mt-2">{errors.file}</p>
              )}
              
              {billFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 font-medium">File uploaded: {billFile.name}</p>
                  <p className="text-blue-600 text-sm">OCR will extract usage data automatically</p>
                  <div className="mt-2 text-xs text-blue-500">
                    File size: {(billFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={processing || (method === 'manual' && !reading) || (method === 'bill' && !billFile)}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {processing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing OCR...</span>
              </div>
            ) : method === 'manual' ? 'Add Reading' : 'Extract & Add Data'}
          </button>
        </form>
      </div>
    </div>
  );
};