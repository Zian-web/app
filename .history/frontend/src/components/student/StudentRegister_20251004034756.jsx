import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import TermsAndConditionsDialog from '../forms/TermsAndConditionsDialog';
import { registerStudent } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Textarea } from '../ui/textarea';

const StudentRegister = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showTermsDialog, setShowTermsDialog] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        whatsappNumber: '',
        dateOfBirth: '',
        gender: '',
        fullAddress: '',
        pinCode: '',
        student_class: '', // Use student_class to avoid keyword conflict
        year: '',
        institutionName: '',
        parentsName: '',
        parentsPhone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
            return;
        }
        // Basic validation
        if (!formData.fullName || !formData.email || !formData.password) {
            toast({ title: "Error", description: "Full Name, Email, and Password are required.", variant: "destructive" });
            return;
        }
        setShowTermsDialog(true);
    };

    const handleTermsAccept = async () => {
        setShowTermsDialog(false);
        setIsLoading(true);

        const data = new FormData();
        for (const key in formData) {
            if (key !== 'confirmPassword') {
                data.append(key, formData[key]);
            }
        }

        try {
            const result = await registerStudent(data);
            login(result.access_token, result.user_type);
            toast({ title: "Success", description: "Registration successful! Welcome." });
            window.location.href = '/student/dashboard';
        } catch (error) {
            toast({ title: "Error", description: error.message || "Registration failed.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTermsDecline = () => setShowTermsDialog(false);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Student Registration</h1>
                    <p className="text-gray-600 mt-2">Create your student account</p>
                </div>

                <Card className="shadow-lg border-gray-200">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Details */}
                            <h3 className="text-lg font-semibold border-b pb-2">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                    <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                                    <Input id="whatsappNumber" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender" onValueChange={(value) => handleSelectChange('gender', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullAddress">Full Address</Label>
                                <Textarea id="fullAddress" name="fullAddress" value={formData.fullAddress} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pinCode">PIN Code</Label>
                                <Input id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleChange} />
                            </div>

                            {/* Academic Details */}
                            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Academic Details</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="student_class">Class</Label>
                                    <Select name="student_class" onValueChange={(value) => handleSelectChange('student_class', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                                        <SelectContent>
                                            {[...Array(12)].map((_, i) => (
                                                <SelectItem key={i + 1} value={String(i + 1)}>Class {i + 1}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year">Academic Year</Label>
                                    <Input id="year" name="year" placeholder="e.g., 2024-2025" value={formData.year} onChange={handleChange} />
                                </div>
                                 <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="institutionName">Institution Name</Label>
                                    <Input id="institutionName" name="institutionName" placeholder="School/College name" value={formData.institutionName} onChange={handleChange} />
                                </div>
                            </div>
                            
                            {/* Parent/Guardian Details */}
                            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Parent/Guardian Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="parentsName">Parent's Name</Label>
                                    <Input id="parentsName" name="parentsName" value={formData.parentsName} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parentsPhone">Parent's Phone</Label>
                                    <Input id="parentsPhone" name="parentsPhone" value={formData.parentsPhone} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6">
                                <Button type="button" variant="outline" onClick={() => navigate('/login')}>Back to Login</Button>
                                <Button type="submit" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            
            <TermsAndConditionsDialog isOpen={showTermsDialog} onAccept={handleTermsAccept} onDecline={handleTermsDecline} />
        </div>
    );
};

export default StudentRegister;

