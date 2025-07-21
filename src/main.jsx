// src/index.js (or src/main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AuthProvider from './Provider/AuthProvider';
import { Toaster } from 'sonner';
import {
  RouterProvider,
} from "react-router";
import { router } from './Router/route';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" richColors />
    </AuthProvider>
  </React.StrictMode>
);