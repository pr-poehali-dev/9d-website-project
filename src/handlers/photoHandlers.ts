import { api } from '@/utils/api';

export const createPhotoHandler = (
  setClassPhoto: (photo: string | null) => void
) => {
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoUrl = e.target?.result as string;
        try {
          await api.updatePhoto(photoUrl);
          setClassPhoto(photoUrl);
        } catch (error) {
          console.error('Error updating photo:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return { handlePhotoUpload };
};
