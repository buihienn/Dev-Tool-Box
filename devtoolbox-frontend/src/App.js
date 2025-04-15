import './App.css';

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import ToolLayout from './pages/ToolLayout';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TokenGeneratorTool from './pages/TokenGeneratorTool';
import HashText from './pages/HashText';
import Bcrypt from './pages/Bcrypt';
import MathEvaluator from './pages/MathEvaluator';
import ULID from './pages/UlidGenerator';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import AdminLayout from './pages/AdminLayout';
import ETACalculator from './pages/ETACalculator';
import PercentageCalculator from './pages/PercentageCalculator';
import IntegerBaseConverter from './pages/IntegerBaseConverter';
import TextToNatoAlphabet from './pages/TextToNatoAlphabet';
import XMLToJSON from './pages/XMLToJSON';
import URLParser from './pages/URLParser';
import URLFormatter from './pages/URLFormatter';
import JWTParser from './pages/JWTParser';
import Chronometer from './pages/Chronometer';
import QRCodeGenerator from './pages/QRCodeGenerator';
import WiFiQRCodeGenerator from './pages/WiFiQRCodeGenerator';
import ImageToBase64 from './pages/ImageToBase64';
import JSONFormatter from './pages/JSONFormatter';
import JSONToCSV from './pages/JSONToCSV';
import DockerComposeConverter from './pages/DockerComposeConverter';
import TemperatureConverter from './pages/TemperatureConverter';
import BenchmarkBuilder from './pages/BenchmarkBuilder';
import LoremIpsumGenerator from './pages/LoremIpsumGenerator';
import TextStatistics from './pages/TextStatistics';
import NumeronymGenerator from './pages/NumeronymGenerator';
import PhoneParser from './pages/PhoneParser';
import IbanValidator from './pages/IbanValidator';
import CreditCardValidator from './pages/CreditCardValidator';

// const AdminGuard = ({ children }) => {
//   const role = localStorage.getItem('role');
  
//   if (role === 'ADMIN') {
//     return children;
//   }
  
//   return <Navigate to="/login" replace />;
// };

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          {/* Đặt ToolLayout làm layout chính */}
          <Route path="/" element={<ToolLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="token-generator" element={<TokenGeneratorTool />} />
            <Route path="hash-text" element={<HashText />} />
            <Route path="bcrypt" element={<Bcrypt />} />
            <Route path="math-evaluator" element={<MathEvaluator />} />
            <Route path="ulid-generator" element={<ULID />} />
            <Route path="/eta-calculator" element={<ETACalculator />} />
            <Route path="/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="base-converter" element={<IntegerBaseConverter />} />
            <Route path="text-to-nato-alphabet" element={<TextToNatoAlphabet />} />
            <Route path="xml-to-json" element={<XMLToJSON />} />
            <Route path="url-parser" element={<URLParser />} />
            <Route path="url-formatter" element={<URLFormatter />} />
            <Route path="jwt-parser" element={<JWTParser />} />
            <Route path="/chronometer" element={<Chronometer />} />
            <Route path="qr-code-generator" element={<QRCodeGenerator />} />
            <Route path="wifi-qr-code-generator" element={<WiFiQRCodeGenerator />} />
            <Route path="image-to-base64" element={<ImageToBase64 />} />
            <Route path="json-formatter" element={<JSONFormatter />} />
            <Route path="json-to-csv" element={<JSONToCSV />} />
            <Route path="docker-compose-converter" element={<DockerComposeConverter />} />
            <Route path="/temperature-converter" element={<TemperatureConverter />} />
            <Route path="/benchmark-builder" element={<BenchmarkBuilder />} />
            <Route path="/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
            <Route path="/text-statistics" element={<TextStatistics />} />
            <Route path="/numeronym-generator" element={<NumeronymGenerator />} />
            <Route path="/phone-parser" element={<PhoneParser />} />
            <Route path="/iban-validator" element={<IbanValidator />} />
            <Route path="/credit-card-validator" element={<CreditCardValidator />} />
          </Route>

          {/* Các route không cần ToolLayout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/admin" element={
          // <AdminGuard>
            <AdminLayout />
          // </AdminGuard>
        } />
          {/* Route không tìm thấy */}
          <Route path="*" element={<div>Không tìm thấy trang!</div>} />
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;