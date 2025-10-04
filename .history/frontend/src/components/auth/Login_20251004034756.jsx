import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User, Lock } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { loginUser } from '../../lib/api';

const Login = () => {
    const navigate = useNavigate();
    const [id, setId] = useState(''); // User's email
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('teacher');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id || !password) {
            toast({ title: "Error", description: "Please enter both email and password.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            const result = await loginUser(id, password, selectedRole);

            if (result.access_token && result.type) {
                await login(result.access_token, result.type);
                toast({ title: "Success", description: "Login successful!" });

                if (result.type === 'teacher') {
                    navigate('/teacher/dashboard', { replace: true });
                } else if (result.type === 'student') {
                    navigate('/student/dashboard', { replace: true });
                } else {
                    // Fallback in case of an unexpected type
                    navigate('/', { replace: true });
                }
            } else {
                throw new Error("Invalid response from server.");
            }
        } catch (error) {
            toast({ title: "Login Failed", description: error.message || "Invalid credentials.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
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
                            {/* Role Selection - This is now just for UI, the backend determines the role */}
                            <div className="space-y-3">
                                <Label className="text-lg font-medium text-gray-700">Select Role</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => setSelectedRole('teacher')}
                                        className={`h-14 text-lg font-medium ${
                                            selectedRole === 'teacher'
                                                ? 'bg-blue-800 hover:bg-blue-900 text-white'
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
                                                ? 'bg-blue-700 hover:bg-blue-800 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                                        }`}
                                        variant={selectedRole === 'student' ? 'default' : 'outline'}
                                    >
                                        Student
                                    </Button>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="id" className="text-lg font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="id"
                                        type="email"
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                        className="pl-10"
                                        placeholder="Enter your email"
                                        required
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
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>

                            <div className="space-y-6 text-center pt-4">
                                <div>
                                    <Link to="/forgot-password" className="text-sm font-medium">Forgot Password?</Link>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-gray-600 text-sm">New to the platform?</p>
                                    <div className="flex items-center justify-center gap-4">
                                        <Link to="/register/teacher">
                                            <Button type="button" variant="link" className="p-0 h-auto">Register as Teacher</Button>
                                        </Link>
                                        <span className="text-gray-300">|</span>
                                        <Link to="/register/student">
                                            <Button type="button" variant="link" className="p-0 h-auto">Register as Student</Button>
                                        </Link>
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

