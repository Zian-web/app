import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { 
  Menu, 
  BookOpen, 
  Users, 
  FileText, 
  Calendar, 
  CreditCard, 
  Bell, 
  User,
  LogOut,
  X
} from 'lucide-react';

const MobileNavigation = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  onLogout, 
  userName, 
  userRole 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabSelect = (tab) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  const getTabIcon = (tabValue) => {
    const iconMap = {
      dashboard: BookOpen,
      batches: Users,
      students: Users,
      materials: FileText,
      attendance: Calendar,
      payments: CreditCard,
      notifications: Bell,
      profile: User
    };
    
    const IconComponent = iconMap[tabValue] || BookOpen;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span>{userRole === 'teacher' ? 'Teacher Portal' : 'Student Portal'}</span>
              </SheetTitle>
            </div>
            <p className="text-sm text-slate-600 text-left">Welcome, {userName}</p>
          </SheetHeader>
          
          <div className="space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.value}
                variant={activeTab === tab.value ? "default" : "ghost"}
                className="w-full justify-start space-x-3 h-12"
                onClick={() => handleTabSelect(tab.value)}
              >
                {getTabIcon(tab.value)}
                <span>{tab.label}</span>
              </Button>
            ))}
            
            <div className="border-t pt-4 mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 h-12"
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;