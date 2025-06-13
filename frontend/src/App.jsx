import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JoinForm from './pages/JoinForm';
import FillForm from './pages/FillForm';
import AdminFormBuilder from './pages/AdminFormBuilder';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinForm />} />
        <Route path="/fill/:formId" element={<FillForm />} />
        <Route path="/admin/create" element={<AdminFormBuilder />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;