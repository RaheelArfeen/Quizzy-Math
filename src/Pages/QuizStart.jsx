import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router"; // Corrected import path for useNavigate
import { CheckCircle, XCircle, Trophy, Timer } from "lucide-react";
import Loader from "./Loader"; // Assuming Loader component exists

const QuizStart = () => {
  const navigate = useNavigate();

  // State for quiz settings (loaded from localStorage)
  const [settings, setSettings] = useState({
    mathType: "addition",
    selectedNumbers: [],
    questionCount: 10,
    timePerQuestion: 30,
    digits: 1,
  });

  // Quiz progression states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  // State to store detailed results for each question as they are answered
  const [detailedQuestionResults, setDetailedQuestionResults] = useState([]);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null); // Ref to hold the interval ID for the timer

  // UI/Interaction states
  const [isQuizReady, setIsQuizReady] = useState(false); // True when questions are generated and settings loaded
  // Stores feedback for the selected answer: { value: user's answer, isCorrect: bool, correctAnswer: actual answer }
  const [selectedAnswerState, setSelectedAnswerState] = useState(null);
  // Prevents multiple clicks during answer processing
  const [isAnswering, setIsAnswering] = useState(false);

  // Helper to generate unique options for a question
  const generateOptions = useCallback((correctAnswer) => {
    const options = new Set([correctAnswer]);
    const deviationRange = Math.max(5, Math.floor(Math.abs(correctAnswer) * 0.15));

    while (options.size < 4) {
      let deviation = Math.floor(Math.random() * (2 * deviationRange + 1)) - deviationRange;
      let option = correctAnswer + deviation;

      if (option === correctAnswer || options.has(option) || option <= 0) {
        option = correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
        if (option <= 0) option = 1;
      }
      options.add(option);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  }, []);

  // Generates a set of quiz questions based on current settings
  const generateQuestions = useCallback((quizSettings) => {
    const newQuestions = [];
    const generatedMultiplicationPairs = new Set();
    const generatedDivisionPairs = new Set();

    for (let i = 0; i < quizSettings.questionCount; i++) {
      let num1, num2;
      let question, answer;
      let attemptCount = 0;

      if (quizSettings.mathType === "multiplication") {
        let baseNumber;
        let multiplier;
        let pairKey;

        do {
          baseNumber = quizSettings.selectedNumbers[Math.floor(Math.random() * quizSettings.selectedNumbers.length)];
          multiplier = Math.floor(Math.random() * 10) + 1;
          pairKey = `${baseNumber}x${multiplier}`;
          attemptCount++;
          if (attemptCount > 200) {
            console.warn("Too many attempts to generate unique multiplication question. Breaking loop.");
            baseNumber = quizSettings.selectedNumbers[0] || 1;
            multiplier = 1;
            break;
          }
        } while (generatedMultiplicationPairs.has(pairKey) && generatedMultiplicationPairs.size < quizSettings.questionCount);

        generatedMultiplicationPairs.add(pairKey);
        num1 = baseNumber;
        num2 = multiplier;
        question = `${num1} × ${num2}`;
        answer = num1 * num2;

      } else if (quizSettings.mathType === "division") {
        let divisor;
        let quotient;
        let pairKey;

        do {
          divisor = quizSettings.selectedNumbers[Math.floor(Math.random() * quizSettings.selectedNumbers.length)];
          if (divisor === 0) divisor = 1;
          quotient = Math.floor(Math.random() * 10) + 1;
          num1 = divisor * quotient;
          num2 = divisor;
          answer = quotient;
          pairKey = `${num1}÷${num2}`;
          attemptCount++;
          if (attemptCount > 200) {
            console.warn("Too many attempts to generate unique division question. Breaking loop.");
            divisor = quizSettings.selectedNumbers[0] || 1;
            num1 = divisor * 1;
            answer = 1;
            break;
          }
        } while (generatedDivisionPairs.has(pairKey) && generatedDivisionPairs.size < quizSettings.questionCount);

        generatedDivisionPairs.add(pairKey);
        question = `${num1} ÷ ${num2}`;

      } else { // Addition and Subtraction logic
        const min = Math.pow(10, quizSettings.digits - 1);
        const max = Math.pow(10, quizSettings.digits) - 1;
        num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        num2 = Math.floor(Math.random() * (max - min + 1)) + min;

        if (quizSettings.mathType === "addition") {
          question = `${num1} + ${num2}`;
          answer = num1 + num2;
        } else if (quizSettings.mathType === "subtraction") {
          const tempNum1 = Math.max(num1, num2);
          const tempNum2 = Math.min(num1, num2);
          num1 = tempNum1;
          num2 = tempNum2;
          question = `${num1} - ${num2}`;
          answer = num1 - num2;
        }
      }
      newQuestions.push({
        id: i + 1,
        question,
        answer,
        options: generateOptions(answer),
      });
    }
    setQuestions(newQuestions);
    setIsQuizReady(true);
  }, [generateOptions]);

  // Handles user's answer selection or timeout
  const handleAnswer = useCallback((selectedUserAnswer) => {
    if (isAnswering) return;
    setIsAnswering(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const currentQ = questions[currentQuestionIndex];
    const isCorrect = selectedUserAnswer !== null && selectedUserAnswer === currentQ.answer;

    setSelectedAnswerState({
      value: selectedUserAnswer,
      isCorrect: isCorrect,
      correctAnswer: currentQ.answer,
    });

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    // Prepare the result for the current question
    const currentQuestionResult = {
      question: currentQ.question,
      correctAnswer: currentQ.answer,
      selectedAnswer: selectedUserAnswer,
      isCorrect: isCorrect,
    };

    // Short delay to allow user to see feedback before moving to next question or results
    setTimeout(() => {
      setSelectedAnswerState(null);
      setIsAnswering(false);

      if (currentQuestionIndex + 1 >= questions.length) {
        // Quiz finished: Combine all results and store in localStorage
        const finalDetailedResults = [...detailedQuestionResults, currentQuestionResult]; // Ensure the last question's result is included
        console.log("Quiz finished! Navigating to results.");
        localStorage.setItem(
          "lastQuizResults",
          JSON.stringify({
            score: newScore,
            total: questions.length,
            mathType: settings.mathType,
            detailedResults: finalDetailedResults, // Use the complete array
          }),
        );
        navigate("/results");
      } else {
        // Not finished: Add current question's result to state and move to next question
        setDetailedQuestionResults(prev => [...prev, currentQuestionResult]); // Update state for next question
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTimeLeft(settings.timePerQuestion);
      }
    }, 1000);
  }, [score, currentQuestionIndex, questions, settings.timePerQuestion, settings.mathType, isAnswering, navigate, detailedQuestionResults]);

  // Effect to load settings from localStorage and generate initial questions
  useEffect(() => {
    const savedSettings = localStorage.getItem("quizSettings");
    let parsedSettings;

    if (savedSettings) {
      try {
        parsedSettings = JSON.parse(savedSettings);
        console.log("Quiz settings loaded from localStorage (QuizStart).");
      } catch (error) {
        console.error("Failed to parse quiz settings from localStorage. Using default mock settings.", error);
        parsedSettings = { mathType: "addition", selectedNumbers: [], questionCount: 10, timePerQuestion: 30, digits: 1 };
      }
    } else {
      console.warn("No quiz settings found in localStorage. Redirecting to config.");
      navigate("/quiz");
      return;
    }

    setSettings(parsedSettings);
    setTimeLeft(parsedSettings.timePerQuestion);
    generateQuestions(parsedSettings);
    setDetailedQuestionResults([]); // Reset detailed results for a new quiz

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [generateQuestions, navigate]);

  // Effect for the countdown timer logic
  useEffect(() => {
    if (!isQuizReady || !settings || currentQuestionIndex >= questions.length || isAnswering) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    if (timeLeft <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (!selectedAnswerState) {
        handleAnswer(null);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestionIndex, isQuizReady, settings, questions.length, isAnswering, timeLeft, selectedAnswerState, handleAnswer]);

  // Show a loader while the quiz is not yet ready
  if (!isQuizReady || !settings || questions.length === 0) {
    return (
      <Loader />
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const questionProgress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timerProgress = (timeLeft / settings.timePerQuestion) * 100;

  return (
    <div className="font-inter p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
      <div className="container mx-auto max-w-2xl z-10 pb-12">
        {/* Progress Bar for Questions */}
        <div className="mb-8 text-center">
          <div className="text-sm text-gray-700 font-semibold mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${questionProgress}%`,
              }}
            />
          </div>
        </div>

        {/* Score and Time Left Display */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8 flex items-center justify-around transform hover:scale-105 transition-transform duration-300"
        >
          <div className="flex flex-col items-center text-center">
            <Trophy className="w-10 h-10 text-yellow-500 mb-2" />
            <div className="text-xl font-bold text-gray-700">Score</div>
            <motion.div
              key={score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-5xl font-extrabold text-purple-700"
            >
              {score}
            </motion.div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Timer className="w-10 h-10 text-red-500 mb-2" />
            <div className="text-xl font-bold text-gray-700">Time Left</div>
            <motion.div
              key={timeLeft}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-5xl font-extrabold text-blue-700"
            >
              {timeLeft}s
            </motion.div>
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white p-10 text-center rounded-3xl shadow-2xl border border-gray-100 transform perspective-1000"
        >
          <div className="text-6xl font-extrabold text-blue-800 mb-10 leading-tight">
            {currentQ.question} = ?
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswerState && selectedAnswerState.value === option;
              const isCorrectAnswerOption = selectedAnswerState && option === selectedAnswerState.correctAnswer;
              const buttonClasses = `
                h-20 text-3xl font-bold rounded-2xl transition-all duration-300 shadow-lg
                flex items-center justify-center relative overflow-hidden
                border-4
                ${isAnswering
                  ? isCorrectAnswerOption
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : isSelected
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed opacity-70'
                  : 'bg-white hover:bg-blue-600 hover:text-white border-blue-300 text-gray-800 hover:border-blue-600'
                }
                ${isAnswering ? 'cursor-not-allowed' : 'cursor-pointer'}
                focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
              `;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  whileHover={isAnswering ? {} : { scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
                  whileTap={isAnswering ? {} : { scale: 0.97 }}
                  disabled={isAnswering}
                  className={buttonClasses}
                >
                  {option}
                  {/* Feedback Icons (Check/X) */}
                  <AnimatePresence>
                    {selectedAnswerState && (
                      <>
                        {isSelected && selectedAnswerState.isCorrect && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="absolute right-4"
                          >
                            <CheckCircle className="w-8 h-8 text-green-600 drop-shadow-md" />
                          </motion.div>
                        )}
                        {isSelected && !selectedAnswerState.isCorrect && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="absolute right-4"
                          >
                            <XCircle className="w-8 h-8 text-red-600 drop-shadow-md" />
                          </motion.div>
                        )}
                        {!isSelected && isCorrectAnswerOption && !selectedAnswerState.isCorrect && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                            className="absolute right-4"
                          >
                            <CheckCircle className="w-8 h-8 text-green-600 drop-shadow-md" />
                          </motion.div>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizStart;
