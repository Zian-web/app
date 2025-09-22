import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Lock, UserCheck } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!id || !password || !selectedRole) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
          <CardDescription className="text-slate-600">
            Sign in to your Teacher-Student Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-slate-700">Select Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm font-medium text-slate-700">
                {selectedRole === 'teacher' ? 'Teacher ID' : 'Student ID'}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="pl-10 h-11"
                  placeholder={selectedRole === 'teacher' ? 'Enter Teacher ID' : 'Enter Student ID'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all duration-200"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
            <p className="text-xs font-medium text-slate-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-slate-600 space-y-1">
              <div><strong>Teacher:</strong> T001 / teacher123</div>
              <div><strong>Student:</strong> S001 / student123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;