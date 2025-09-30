import React from 'react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import MobileNavigation from './MobileNavigation';
import { BookOpen, LogOut } from 'lucide-react';

const ResponsiveLayout = ({ 
  children, 
  tabs, 
  activeTab, 
  onTabChange, 
  onLogout, 
  userName, 
  userRole 
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            {/* Mobile Navigation */}
            <MobileNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              onLogout={onLogout}
              userName={userName}
              userRole={userRole}
            />
            
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-slate-900">
                  {userRole === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                </h1>
                <p className="text-xs text-slate-600 hidden sm:block">Welcome, {userName}</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Logout */}
          <div className="hidden md:block">
            <Button 
              onClick={onLogout}
              variant="outline" 
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Desktop Navigation */}
        <div className="hidden md:block mb-6">
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="grid w-full grid-flow-col auto-cols-fr bg-white">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  className="flex items-center space-x-2"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
