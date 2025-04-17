import './App.css';

import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import ToolLayout from './pages/ToolLayout';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/guards/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import { ToolsProvider } from './context/ToolsContext';

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
import MacAddressGenerator from './pages/MacAddressGenerator';
import Ipv4Converter from './pages/Ipv4Converter';
import Ipv4RangeExpander from './pages/Ipv4RangeExpander';

function App() {
  return (
    <AuthProvider>
      <ToolsProvider>
        <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute requiredRole="anonymous" />}>
              <Route path="/" element={<ToolLayout />}>
                <Route index element={<UserDashboard />} />
                <Route path="token" element={<TokenGeneratorTool />} />
                <Route path="hash" element={<HashText />} /> 
                <Route path="bcrypt" element={<Bcrypt />} />
                <Route path="math" element={<MathEvaluator />} />
                <Route path="ulid" element={<ULID />} />
                <Route path="eta-calculator" element={<ETACalculator />} /> 
                <Route path="percentage-calculator" element={<PercentageCalculator />} /> 
                <Route path="base-converter" element={<IntegerBaseConverter />} />
                <Route path="text-to-nato-alphabet" element={<TextToNatoAlphabet />} />
                <Route path="xml-to-json" element={<XMLToJSON />} />
                <Route path="url-parser" element={<URLParser />} />
                <Route path="url-formatter" element={<URLFormatter />} />
                <Route path="jwt-parser" element={<JWTParser />} />
                <Route path="chronometer" element={<Chronometer />} /> 
                <Route path="qr-code" element={<QRCodeGenerator />} /> 
                <Route path="wifi-qr-code" element={<WiFiQRCodeGenerator />} /> 
                <Route path="image-to-base64" element={<ImageToBase64 />} />
                <Route path="json-formatter" element={<JSONFormatter />} />
                <Route path="json-to-csv" element={<JSONToCSV />} />
                <Route path="docker-compose-converter" element={<DockerComposeConverter />} />
                <Route path="temperature-converter" element={<TemperatureConverter />} /> 
                <Route path="benchmark" element={<BenchmarkBuilder />} /> 
                <Route path="lorem-ipsum" element={<LoremIpsumGenerator />} /> 
                <Route path="text-statistics" element={<TextStatistics />} /> 
                <Route path="numeronym" element={<NumeronymGenerator />} /> 
                <Route path="phone-parser" element={<PhoneParser />} /> 
                <Route path="iban" element={<IbanValidator />} /> 
                <Route path="credit-card" element={<CreditCardValidator />} /> 
                <Route path="mac-address" element={<MacAddressGenerator />} /> 
                <Route path="ipv4" element={<Ipv4Converter />} /> 
                <Route path="ipv4-range" element={<Ipv4RangeExpander />} /> 
              </Route>
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin/*" element={<AdminLayout />} />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<div>Không tìm thấy trang!</div>} />
          </Routes>
        </BrowserRouter>
        </SidebarProvider>
      </ToolsProvider>
    </AuthProvider>
  );
}

export default App;