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
import { HeadProvider } from 'react-head';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HeadProvider>
          <RouterProvider router={router} />
          <Toaster position="bottom-right" richColors />
        </HeadProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);