import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Lock } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('teacher');
  const { login } = useAuth();
  const { toast } = useToast();

  // Reset form state when component mounts
  React.useEffect(() => {
    setId('');
    setPassword('');
    setSelectedRole('teacher');
  }, []);

  const handleSubmit = async (e) => {
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
    
    if (success) {
      // Clear form
      setId('');
      setPassword('');
      
      // Navigate directly to dashboard
      navigate('/', { replace: true });
    } else {
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
                    className="pl-10"
                    placeholder={selectedRole === 'teacher' ? 'Enter Teacher ID' : 'Enter Student ID'}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full h-12 text-lg">
                Login
              </Button>

              {/* Links */}
              <div className="space-y-4 text-center">
                <div>
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">New to the platform?</p>
                  <div className="space-x-4">
                    <Button
                      variant="link"
                      onClick={() => navigate('/register/teacher')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Register as Teacher
                    </Button>
                    <span className="text-gray-400">|</span>
                    <Button
                      variant="link"
                      onClick={() => navigate('/register/student')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Register as Student
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
