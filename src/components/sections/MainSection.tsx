import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MainSectionProps {
  students: Array<{id: number; name: string}>;
  classPhoto: string | null;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MainSection = ({ students, classPhoto, handlePhotoUpload }: MainSectionProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-900 tracking-tight">9Д</h1>
        <p className="text-xl text-gray-600">Класс активных и творческих учеников</p>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            id="photo-upload"
          />
          {classPhoto ? (
            <div className="relative group">
              <img 
                src={classPhoto} 
                alt="Фото класса 9Д" 
                className="w-96 h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-center">
                  <Icon name="Camera" size={32} className="mx-auto mb-2" />
                  <p>Изменить фото</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-96 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:border-primary hover:bg-blue-50 transition-colors duration-300 cursor-pointer">
              <div className="text-center text-gray-500">
                <Icon name="Camera" size={48} className="mx-auto mb-2" />
                <p className="text-lg">Добавить фото класса</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{students.length}</div>
            <div className="text-gray-600">Учеников в классе</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-xl font-semibold text-primary mb-2">Кристина Робертовна</div>
            <div className="text-gray-600">Классный руководитель</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainSection;