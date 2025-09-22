import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Lock } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('teacher');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!id || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const success = login(id, password, selectedRole);
    
    if (!success) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Teacher-Student
          </h1>
          <h1 className="text-4xl font-bold text-blue-600 mb-6">
            Management System
          </h1>
          <p className="text-gray-600 text-lg">
            Select your role and login to access your dashboard
          </p>
        </div>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-lg font-medium text-gray-700">Select Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={() => setSelectedRole('teacher')}
                    className={`h-14 text-lg font-medium ${
                      selectedRole === 'teacher'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                    }`}
                    variant={selectedRole === 'teacher' ? 'default' : 'outline'}
                  >
                    Teacher
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`h-14 text-lg font-medium ${
                      selectedRole === 'student'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                    }`}
                    variant={selectedRole === 'student' ? 'default' : 'outline'}
                  >
                    Student
                  </Button>
                </div>
              </div>

              {/* ID Field */}
              <div className="space-y-2">
                <Label htmlFor="id" className="text-lg font-medium text-gray-700">
                  {selectedRole === 'teacher' ? 'Teacher ID' : 'Student ID'}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="id"
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="pl-12 h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={selectedRole === 'teacher' ? 'Enter Teacher ID' : 'Enter Student ID'}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter Password"
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg transition-all duration-200"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sample Credentials */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg font-medium mb-3">Sample Credentials:</p>
          <div className="bg-gray-100 rounded-lg p-4 space-y-2">
            <p className="text-blue-600 font-medium text-lg">Use Teacher1 / password</p>
            <p className="text-blue-600 font-medium text-lg">Use Student1 / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;