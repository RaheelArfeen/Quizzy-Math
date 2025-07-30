import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

const useGameLogic = () => {
  // --- State Management ---
  const [selectedOperation, setSelectedOperation] = useState('');
  const [gameSettings, setGameSettings] = useState({
    selectedTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    digitCount: 2,
    timePerQuestion: 10,
    totalQuestions: 10
  });
  const [gameState, setGameState] = useState({
    currentQuestion: 0,
    score: 0,
    timeLeft: 10,
    questions: [],
    currentAnswer: 0,
    choices: [],
    selectedAnswer: null,
    showFeedback: false,
    userAnswers: []
  });
  const [currentScreen, setCurrentScreen] = useState('home');

  // --- Audio References (Preloaded for efficiency) ---
  // Note: In a real app, you might want to handle audio paths more dynamically or ensure they are bundled correctly.
  // For this example, assuming '/correct.mp3' etc. are accessible from the public directory.
  const correctSoundRef = useRef(new Audio('/correct.mp3'));
  const incorrectSoundRef = useRef(new Audio('/incorrect.mp3'));
  const resultsSoundRef = useRef(new Audio('/results.mp3'));

  // --- Game Logic Functions ---

  // Timer effect for quiz screen
  useEffect(() => {
    let timer;
    if (currentScreen === 'quiz' && gameState.timeLeft > 0 && !gameState.showFeedback) {
      timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (currentScreen === 'quiz' && gameState.timeLeft === 0 && !gameState.showFeedback) {
      // Time's up - show feedback as wrong answer
      setGameState(prev => ({
        ...prev,
        selectedAnswer: null, // No answer selected
        showFeedback: true
      }));
      // Automatically move to the next question after a short delay
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
    return () => clearTimeout(timer); // Cleanup timer on unmount or dependency change
  }, [currentScreen, gameState.timeLeft, gameState.showFeedback]); // Dependencies for timer

  // Play results sound when screen changes to 'results'
  useEffect(() => {
    if (currentScreen === 'results') {
      resultsSoundRef.current.play().catch(e => console.error("Error playing results sound:", e));
    }
  }, [currentScreen]); // Dependency for results sound

  // Function to open the settings modal for a specific operation
  const openModal = useCallback((operation) => {
    setSelectedOperation(operation);
    setShowModal(true); // Assuming setShowModal is passed or managed externally if needed for the modal
  }, []);

  // Function to close the settings modal
  const closeModal = useCallback(() => {
    // setShowModal(false); // Assuming setShowModal is passed or managed externally if needed for the modal
    setSelectedOperation('');
  }, []);

  // Generates a random number with a specified number of digits
  const generateRandomNumber = useCallback((digits) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

  // Generates a set of choices including the correct answer and three distractors
  const generateChoices = useCallback((correctAnswer) => {
    const choices = new Set([correctAnswer]); // Start with the correct answer
    while (choices.size < 4) { // Generate 3 more unique wrong answers
      let wrongAnswer;
      // Generate wrong answers within a reasonable range around the correct answer
      const range = Math.max(10, Math.ceil(correctAnswer * 0.3)); // Dynamic range based on answer magnitude
      wrongAnswer = correctAnswer + Math.floor(Math.random() * (2 * range + 1)) - range;

      if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
        choices.add(wrongAnswer);
      }
    }
    return Array.from(choices).sort(() => Math.random() - 0.5); // Shuffle the choices
  }, []);

  // Generates a list of questions based on selected operation and settings
  const generateQuestions = useCallback(() => {
    const questions = [];
    const questionSet = new Set(); // To prevent duplicate questions
    const maxAttempts = gameSettings.totalQuestions * 5; // Safety break for question generation loop

    let attempts = 0;

    while (questions.length < gameSettings.totalQuestions && attempts < maxAttempts) {
      let question, answer;
      attempts++;

      switch (selectedOperation) {
        case 'addition': {
          const num1 = generateRandomNumber(gameSettings.digitCount);
          const num2 = generateRandomNumber(gameSettings.digitCount);
          question = `${num1} + ${num2}`;
          answer = num1 + num2;
          break;
        }
        case 'subtraction': {
          const num1 = generateRandomNumber(gameSettings.digitCount);
          const num2 = generateRandomNumber(gameSettings.digitCount);
          const larger = Math.max(num1, num2);
          const smaller = Math.min(num1, num2);
          question = `${larger} - ${smaller}`;
          answer = larger - smaller;
          break;
        }
        case 'multiplication': {
          if (gameSettings.selectedTables.length === 0) {
            console.warn("No tables selected for multiplication.");
            return []; // Return empty if no tables are selected
          }
          const num1 = gameSettings.selectedTables[Math.floor(Math.random() * gameSettings.selectedTables.length)];
          const num2 = Math.floor(Math.random() * 10) + 1; // Multiply by numbers 1-10
          question = `${num1} × ${num2}`;
          answer = num1 * num2;
          break;
        }
        case 'division': {
          if (gameSettings.selectedTables.length === 0) {
            console.warn("No tables selected for division.");
            return []; // Return empty if no tables are selected
          }
          const divisor = gameSettings.selectedTables[Math.floor(Math.random() * gameSettings.selectedTables.length)];
          const quotient = Math.floor(Math.random() * 10) + 1; // Quotient 1-10
          const dividend = divisor * quotient; // Ensure whole number division
          question = `${dividend} ÷ ${divisor}`;
          answer = quotient;
          break;
        }
        default:
          question = "Error";
          answer = 0;
      }

      if (questionSet.has(question)) continue; // Skip if question already exists

      questionSet.add(question);
      const choices = generateChoices(answer);
      questions.push({ question, answer, choices });
    }

    return questions;
  }, [selectedOperation, gameSettings.digitCount, gameSettings.selectedTables, gameSettings.totalQuestions, generateRandomNumber, generateChoices]);

  // Initializes and starts the quiz
  const startQuiz = useCallback(() => {
    // Validation for multiplication/division tables
    if ((selectedOperation === 'multiplication' || selectedOperation === 'division') && gameSettings.selectedTables.length === 0) {
      toast.error('Please select at least one number for Multiplication/Division!');
      return false; // Indicate failure to start
    }

    const questions = generateQuestions();
    if (questions.length === 0) {
      toast.error('Failed to generate questions. Please check settings.');
      return false; // Indicate failure to start
    }

    // Initialize game state for the new quiz
    setGameState({
      currentQuestion: 0,
      score: 0,
      timeLeft: gameSettings.timePerQuestion,
      questions,
      currentAnswer: questions[0]?.answer || 0, // Set initial current answer
      choices: questions[0]?.choices || [],     // Set initial choices
      selectedAnswer: null,
      showFeedback: false,
      userAnswers: []
    });
    setCurrentScreen('quiz'); // Navigate to quiz screen
    return true; // Indicate success
  }, [selectedOperation, gameSettings, generateQuestions]);

  // Moves to the next question or ends the quiz if all questions are answered
  const nextQuestion = useCallback(() => {
    const nextQuestionIndex = gameState.currentQuestion + 1;

    if (nextQuestionIndex >= gameSettings.totalQuestions) {
      setCurrentScreen('results'); // End quiz and show results
    } else {
      const nextQ = gameState.questions[nextQuestionIndex];
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextQuestionIndex,
        timeLeft: gameSettings.timePerQuestion, // Reset timer for next question
        currentAnswer: nextQ?.answer || 0,
        choices: nextQ?.choices || [],
        selectedAnswer: null, // Reset selected answer
        showFeedback: false // Hide feedback for the new question
      }));
    }
  }, [gameState.currentQuestion, gameState.questions, gameSettings.totalQuestions, gameSettings.timePerQuestion]);

  // Handles user selecting an answer
  const selectAnswer = useCallback((answer) => {
    if (gameState.showFeedback) return; // Prevent multiple selections

    const isCorrect = answer === gameState.currentAnswer;

    // Record the user's answer details
    const userAnswer = {
      questionIndex: gameState.currentQuestion,
      question: gameState.questions[gameState.currentQuestion].question,
      correctAnswer: gameState.currentAnswer,
      userAnswer: answer,
      isCorrect: isCorrect,
      timeTaken: gameSettings.timePerQuestion - gameState.timeLeft // Time taken for this question
    };

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true, // Show feedback (correct/incorrect)
      score: isCorrect ? prev.score + 1 : prev.score, // Update score
      userAnswers: [...prev.userAnswers, userAnswer] // Add to user answers history
    }));

    // Play sounds based on correctness
    if (isCorrect) {
      correctSoundRef.current.currentTime = 0; // Rewind to start
      correctSoundRef.current.play().catch(e => console.error("Error playing correct sound:", e));
    } else {
      incorrectSoundRef.current.currentTime = 0; // Rewind to start
      incorrectSoundRef.current.play().catch(e => console.error("Error playing incorrect sound:", e));
    }

    // Move to the next question after a short delay to show feedback
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }, [gameState, gameSettings.timePerQuestion, nextQuestion]);

  // Resets the game to play again with new questions
  const resetGameForPlayAgain = useCallback(() => {
    const newQuestions = generateQuestions(); // Generate a fresh set of questions
    if (newQuestions.length === 0) {
      toast.error('Failed to generate questions for replay. Please check settings.');
      setCurrentScreen('home'); // Go back to home if questions cannot be generated
      return;
    }
    setGameState({
      currentQuestion: 0,
      score: 0,
      timeLeft: gameSettings.timePerQuestion,
      questions: newQuestions,
      currentAnswer: newQuestions[0]?.answer || 0,
      choices: newQuestions[0]?.choices || [],
      selectedAnswer: null,
      showFeedback: false,
      userAnswers: []
    });
    setCurrentScreen('quiz'); // Start the quiz again
  }, [generateQuestions, gameSettings.timePerQuestion]);

  // Determines the CSS class for choice buttons based on game state
  const getChoiceButtonClass = useCallback((choice) => {
    if (!gameState.showFeedback) {
      // Default style when no feedback is shown
      return "bg-white border-4 border-purple-300 text-purple-600";
    }
    // Styles when feedback is shown
    if (choice === gameState.currentAnswer) {
      return "bg-green-500 border-4 border-green-600 text-white scale-105"; // Correct answer
    }
    if (choice === gameState.selectedAnswer) {
      return "bg-red-500 border-4 border-red-600 text-white"; // User's incorrect answer
    }
    return "bg-gray-300 border-4 border-gray-400 text-gray-600 opacity-50"; // Other choices
  }, [gameState.showFeedback, gameState.currentAnswer, gameState.selectedAnswer]);

  // Return all state variables and functions needed by the App component
  return {
    // State
    showModal: false, // This state is still managed in App.js for the modal component
    selectedOperation,
    gameSettings,
    gameState,
    currentScreen,

    // Setters
    setSelectedOperation,
    setGameSettings,
    setGameState,
    setCurrentScreen,

    // Functions
    openModal,
    closeModal,
    startQuiz,
    nextQuestion,
    selectAnswer,
    resetGameForPlayAgain,
    getChoiceButtonClass,
  };
};

export default useGameLogic;
