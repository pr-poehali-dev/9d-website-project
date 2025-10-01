import { useState } from 'react';
import { api } from '@/utils/api';

export const usePasswordAuth = () => {
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const checkPassword = (action: () => void) => {
    setPendingAction(() => action);
    setPasswordDialog(true);
    setPasswordInput('');
    setPasswordError('');
  };
  
  const confirmPassword = async () => {
    try {
      const isValid = await api.verifyPassword(passwordInput);
      
      if (isValid) {
        if (pendingAction) pendingAction();
        setPasswordDialog(false);
        setPasswordInput('');
        setPasswordError('');
        setPendingAction(null);
      } else {
        setPasswordError('Неверный пароль');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError('Ошибка проверки пароля');
    }
  };

  return {
    passwordDialog,
    setPasswordDialog,
    passwordInput,
    setPasswordInput,
    passwordError,
    setPasswordError,
    checkPassword,
    confirmPassword,
    setPendingAction
  };
};
