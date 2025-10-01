import { api } from '@/utils/api';

export const validateHomeworkForm = (
  homeworkForm: { subject: string; task: string; due: string },
  setFormErrors: (errors: {[key: string]: string}) => void
) => {
  const errors: {[key: string]: string} = {};
  if (!homeworkForm.subject.trim()) errors.homeworkSubject = 'Предмет обязателен';
  if (!homeworkForm.task.trim()) errors.homeworkTask = 'Задание обязательно';
  if (homeworkForm.task.length < 5) errors.homeworkTask = 'Задание должно содержать минимум 5 символов';
  if (!homeworkForm.due) errors.homeworkDue = 'Дата сдачи обязательна';
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

export const createHomeworkHandlers = (
  homeworkForm: { subject: string; task: string; due: string },
  setHomeworkForm: (form: { subject: string; task: string; due: string }) => void,
  homeworkItems: Array<{id: number; subject: string; task: string; due: string; status: string}>,
  setHomeworkItems: (items: Array<{id: number; subject: string; task: string; due: string; status: string}>) => void,
  editingHomework: {id: number; subject: string; task: string; due: string} | null,
  setEditingHomework: (homework: {id: number; subject: string; task: string; due: string} | null) => void,
  dialogOpen: {[key: string]: boolean},
  setDialogOpen: (open: {[key: string]: boolean}) => void,
  setFormErrors: (errors: {[key: string]: string}) => void,
  checkPassword: (action: () => void) => void
) => {
  const handleAddHomework = () => {
    if (!validateHomeworkForm(homeworkForm, setFormErrors)) return;
    
    const executeAction = async () => {
      try {
        if (editingHomework) {
          await api.updateHomework(editingHomework.id, homeworkForm.subject, homeworkForm.task, homeworkForm.due, 'active');
          setHomeworkItems(homeworkItems.map(item => 
            item.id === editingHomework.id 
              ? { ...item, subject: homeworkForm.subject, task: homeworkForm.task, due: homeworkForm.due }
              : item
          ));
          setEditingHomework(null);
        } else {
          const response = await api.addHomework(homeworkForm.subject, homeworkForm.task, homeworkForm.due, 'active');
          const newHomework = {
            id: response.id,
            subject: homeworkForm.subject,
            task: homeworkForm.task,
            due: homeworkForm.due,
            status: 'active'
          };
          setHomeworkItems([newHomework, ...homeworkItems]);
        }
        setHomeworkForm({ subject: '', task: '', due: '' });
        setDialogOpen({...dialogOpen, homework: false});
        setFormErrors({});
      } catch (error) {
        console.error('Error saving homework:', error);
      }
    };
    
    checkPassword(executeAction);
  };
  
  const handleEditHomework = (homework: {id: number; subject: string; task: string; due: string}) => {
    checkPassword(() => {
      setEditingHomework(homework);
      setHomeworkForm({ subject: homework.subject, task: homework.task, due: homework.due });
      setDialogOpen({...dialogOpen, homework: true});
    });
  };
  
  const handleDeleteHomework = (id: number) => {
    checkPassword(async () => {
      try {
        await api.deleteHomework(id);
        setHomeworkItems(homeworkItems.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting homework:', error);
      }
    });
  };

  return {
    handleAddHomework,
    handleEditHomework,
    handleDeleteHomework
  };
};
