import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const TeacherSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Классный руководитель</h2>
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={40} className="text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900">Кристина Робертовна</h3>
              <p className="text-gray-600">Учитель физкультуры</p>
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">kristina@school.edu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">+7 (999) 123-45-67</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherSection;