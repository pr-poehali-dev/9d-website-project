import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export const useClassData = () => {
  const [classPhoto, setClassPhoto] = useState<string | null>(null);
  const [newsItems, setNewsItems] = useState<Array<{id: number; title: string; date: string; content: string}>>([]);
  const [students, setStudents] = useState<Array<{id: number; name: string}>>([]);
  const [homeworkItems, setHomeworkItems] = useState<Array<{id: number; subject: string; task: string; due: string; status: string}>>([]);
  const [materialItems, setMaterialItems] = useState<Array<{id: number; title: string; type: string; size: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.fetchAllData();
        setClassPhoto(data.classPhoto);
        setNewsItems(data.newsItems);
        setStudents(data.students);
        setHomeworkItems(data.homeworkItems);
        setMaterialItems(data.materialItems);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return {
    classPhoto,
    setClassPhoto,
    newsItems,
    setNewsItems,
    students,
    setStudents,
    homeworkItems,
    setHomeworkItems,
    materialItems,
    setMaterialItems,
    isLoading
  };
};
