import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

// Create the context
export const EducationContext = createContext();

// Custom hook to use the education context
export const useEducation = () => useContext(EducationContext);

export const EducationProvider = ({ children }) => {
  const { userId, isSignedIn } = useAuth();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [savedLessons, setSavedLessons] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load user's education data when they sign in
  useEffect(() => {
    if (isSignedIn && userId) {
      loadEducationData();
    } else {
      // Reset state if user is not signed in
      setCompletedLessons([]);
      setSavedLessons([]);
      setUserPoints(0);
    }
  }, [isSignedIn, userId]);

  // Load education data from localStorage (in a real app, this would be from an API)
  const loadEducationData = () => {
    setLoading(true);
    try {
      // Get completed lessons
      const savedCompletedLessons = JSON.parse(localStorage.getItem(`completed-lessons-${userId}`) || '[]');
      setCompletedLessons(savedCompletedLessons);
      
      // Get saved/bookmarked lessons
      const savedBookmarkedLessons = JSON.parse(localStorage.getItem(`saved-lessons-${userId}`) || '[]');
      setSavedLessons(savedBookmarkedLessons);
      
      // Get learning points
      const savedPoints = JSON.parse(localStorage.getItem(`learning-points-${userId}`) || '0');
      setUserPoints(savedPoints);
      
    } catch (error) {
      console.error('Error loading education data:', error);
      toast.error('Failed to load your learning progress');
    } finally {
      setLoading(false);
    }
  };

  // Mark a lesson as completed
  const completeLesson = (lessonId, pointsEarned) => {
    if (!isSignedIn) {
      toast.error('Please sign in to track your progress');
      return;
    }
    
    try {
      // Don't add duplicate entries
      if (!completedLessons.includes(lessonId)) {
        const updatedLessons = [...completedLessons, lessonId];
        setCompletedLessons(updatedLessons);
        localStorage.setItem(`completed-lessons-${userId}`, JSON.stringify(updatedLessons));
        
        // Update points
        const newPoints = userPoints + pointsEarned;
        setUserPoints(newPoints);
        localStorage.setItem(`learning-points-${userId}`, JSON.stringify(newPoints));
        
        toast.success(`Lesson completed! You earned ${pointsEarned} points.`);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to update your progress');
    }
  };

  // Save/bookmark a lesson
  const toggleSaveLesson = (lessonId) => {
    if (!isSignedIn) {
      toast.error('Please sign in to save lessons');
      return;
    }
    
    try {
      let updatedSavedLessons;
      
      if (savedLessons.includes(lessonId)) {
        // Remove from saved lessons
        updatedSavedLessons = savedLessons.filter(id => id !== lessonId);
        toast.success('Lesson removed from saved items');
      } else {
        // Add to saved lessons
        updatedSavedLessons = [...savedLessons, lessonId];
        toast.success('Lesson saved for later');
      }
      
      setSavedLessons(updatedSavedLessons);
      localStorage.setItem(`saved-lessons-${userId}`, JSON.stringify(updatedSavedLessons));
      
    } catch (error) {
      console.error('Error toggling lesson save status:', error);
      toast.error('Failed to update your saved lessons');
    }
  };

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  // Check if a lesson is saved
  const isLessonSaved = (lessonId) => {
    return savedLessons.includes(lessonId);
  };

  // Get total completed lessons count
  const getCompletedLessonsCount = () => {
    return completedLessons.length;
  };

  return (
    <EducationContext.Provider
      value={{
        userPoints,
        completedLessons,
        savedLessons,
        loading,
        completeLesson,
        toggleSaveLesson,
        isLessonCompleted,
        isLessonSaved,
        getCompletedLessonsCount
      }}
    >
      {children}
    </EducationContext.Provider>
  );
};

export default EducationProvider; 