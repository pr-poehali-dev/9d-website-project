import { api } from '@/utils/api';

export const validateMaterialForm = (
  materialForm: { title: string; file: File | null },
  editingMaterial: {id: number; title: string} | null,
  setFormErrors: (errors: {[key: string]: string}) => void
) => {
  const errors: {[key: string]: string} = {};
  if (!materialForm.title.trim()) errors.materialTitle = 'Название обязательно';
  if (!editingMaterial && !materialForm.file) errors.materialFile = 'Файл обязателен';
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

export const createMaterialHandlers = (
  materialForm: { title: string; file: File | null },
  setMaterialForm: (form: { title: string; file: File | null }) => void,
  materialItems: Array<{id: number; title: string; type: string; size: string; fileUrl?: string}>,
  setMaterialItems: (items: Array<{id: number; title: string; type: string; size: string; fileUrl?: string}>) => void,
  editingMaterial: {id: number; title: string} | null,
  setEditingMaterial: (material: {id: number; title: string} | null) => void,
  dialogOpen: {[key: string]: boolean},
  setDialogOpen: (open: {[key: string]: boolean}) => void,
  setFormErrors: (errors: {[key: string]: string}) => void,
  checkPassword: (action: () => void) => void
) => {
  const handleAddMaterial = () => {
    if (!validateMaterialForm(materialForm, editingMaterial, setFormErrors)) return;
    
    const executeAction = async () => {
      try {
        if (editingMaterial) {
          await api.updateMaterial(editingMaterial.id, materialForm.title);
          setMaterialItems(materialItems.map(item => 
            item.id === editingMaterial.id 
              ? { ...item, title: materialForm.title }
              : item
          ));
          setEditingMaterial(null);
        } else if (materialForm.file) {
          const type = materialForm.file.name.split('.').pop()?.toUpperCase() || 'FILE';
          const size = `${Math.round(materialForm.file.size / 1024)} КБ`;
          
          const reader = new FileReader();
          reader.onload = async (e) => {
            const fileUrl = e.target?.result as string;
            const response = await api.addMaterial(materialForm.title, type, size, fileUrl);
            const newMaterial = {
              id: response.id,
              title: materialForm.title,
              type: type,
              size: size,
              fileUrl: fileUrl
            };
            setMaterialItems([newMaterial, ...materialItems]);
          };
          reader.readAsDataURL(materialForm.file);
        }
        setMaterialForm({ title: '', file: null });
        setDialogOpen({...dialogOpen, material: false});
        setFormErrors({});
      } catch (error) {
        console.error('Error saving material:', error);
      }
    };
    
    checkPassword(executeAction);
  };
  
  const handleEditMaterial = (material: {id: number; title: string}) => {
    checkPassword(() => {
      setEditingMaterial(material);
      setMaterialForm({ title: material.title, file: null });
      setDialogOpen({...dialogOpen, material: true});
    });
  };
  
  const handleDeleteMaterial = (id: number) => {
    checkPassword(async () => {
      try {
        await api.deleteMaterial(id);
        setMaterialItems(materialItems.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    });
  };

  return {
    handleAddMaterial,
    handleEditMaterial,
    handleDeleteMaterial
  };
};