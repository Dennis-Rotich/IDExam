// pages/Teacher/CreateExam.jsx
import React, { useState } from 'react';
//import ExamMetadataForm from '../../components/Teacher/ExamMetadataForm';
//import TestCaseManager from '../../components/Teacher/TestCaseManager';

export default function CreateExam() {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    testCases: [{ input: '', output: '', isHidden: false }]
  });

  const handleSave = () => {
    console.log("Sending to tAhIni API:", examData);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Exam</h1>
      
      <ExamMetadataForm data={examData} setData={setExamData} />
      
      <hr className="my-8 border-slate-200" />
      
      <TestCaseManager 
        testCases={examData.testCases} 
        setTestCases={(cases) => setExamData({...examData, testCases: cases})} 
      />

      <button onClick={handleSave} className="mt-8 bg-tahini-accent text-white px-6 py-2 rounded">
        Publish Exam
      </button>
    </div>
  );
}