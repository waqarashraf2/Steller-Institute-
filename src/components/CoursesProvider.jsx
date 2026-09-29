import { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { itCourses as initialIt, beautyCourses as initialBeauty } from '../data/courses';

const CoursesContext = createContext();

const CACHE_KEY = 'stellar_courses_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const defaultFallbackCourses = [
  ...initialIt.map(c => ({ ...c, category: 'it', image_url: c.image, banner_url: c.bannerImage })),
  ...initialBeauty.map(c => ({ ...c, category: 'beauty', image_url: c.image, banner_url: c.bannerImage }))
];

function getInitialCourses() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL && Array.isArray(data)) {
        return data;
      }
    }
  } catch {}
  return defaultFallbackCourses;
}

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState(getInitialCourses);
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async (refresh = false) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const refreshParam = refresh ? `?refresh=${Date.now()}` : '';
      const response = await fetch(`${apiUrl}/courses${refreshParam}`, refresh ? { cache: 'no-store' } : undefined);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setCourses(data);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
          } catch {}
        }
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();

    const handleCoursesUpdated = () => fetchCourses(true);
    window.addEventListener('stellar_courses_updated', handleCoursesUpdated);
    return () => {
      window.removeEventListener('stellar_courses_updated', handleCoursesUpdated);
    };
  }, [fetchCourses]);

  const itCourses = courses.filter(c => c.category === 'it');
  const beautyCourses = courses.filter(c => c.category === 'beauty');

  const refreshCourses = () => {
    setLoading(true);
    fetchCourses();
  };

  return (
    <CoursesContext.Provider value={{ courses, itCourses, beautyCourses, loading, refreshCourses }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  return useContext(CoursesContext);
}
