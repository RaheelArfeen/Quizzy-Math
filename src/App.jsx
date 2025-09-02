import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

import Header from './Components/Header';
import HomePage from './Pages/HomePage';
import QuizSetupPage from './Pages/QuizSetupPage';
import QuizPage from './Pages/QuizPage';
import QuizResultsPage from './Pages/QuizResultsPage';
import DashboardPage from './Pages/DashboardPage';
import TimeTablesPage from './Pages/TimeTablesPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-sky-50">
        <Header />
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz-setup/:operation" element={<QuizSetupPage />} />
              <Route path="/quiz/:operation" element={<QuizPage />} />
              <Route path="/quiz-results" element={<QuizResultsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/time-tables" element={<TimeTablesPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Toaster position="bottom-right" richColors />
      </div>
    </Router>
  );
};

export default App;