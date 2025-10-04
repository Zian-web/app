import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import TermsAndConditionsDialog from '../forms/TermsAndConditionsDialog';
import { registerTeacher } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const TeacherRegister = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login } = useAuth();
    const [showTermsDialog, setShowTermsDialog] = useState(false);
    const [selfieFile, setSelfieFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
        district: '',
        state: '',
        pinCode: '',
        subjects: '',
        classes: '',
        board: '',
        university: '',
        socialLinks: '',
        requiresOnlinePayment: false,
        bankAccountNumber: '',
        ifscCode: '',
        accountType: '',
        bankName: '',
        governmentId: '',
        permanentAddress: '',
        correspondenceAddress: '',
        taxId: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelfieFile(e.target.files[0]);
        }
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

        const requiredFields = [
            'fullName', 'email', 'password', 'phoneNumber', 'dateOfBirth', 
            'gender', 'fullAddress', 'district', 'state', 'pinCode', 
            'subjects', 'classes', 'board', 'university'
        ];
        
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            toast({ title: "Error", description: `Please fill in all required fields. Missing: ${missingFields.join(', ')}`, variant: "destructive" });
            return;
        }
        
        setShowTermsDialog(true);
    };

    const handleTermsAccept = async () => {
        setShowTermsDialog(false);
        setIsLoading(true);
        
        // Format the date correctly for the API
        const formattedData = {
            ...formData,
            dateOfBirth: formData.dateOfBirth, // Make sure this is in YYYY-MM-DD format
            whatsappNumber: formData.whatsappNumber || formData.phoneNumber, // Fallback to phone number if not provided
            requiresOnlinePayment: formData.requiresOnlinePayment || false
        };

        // Create FormData
        const data = new FormData();
        Object.keys(formattedData).forEach(key => {
            // Skip confirmPassword
            if (key === 'confirmPassword') return;
            
            // Handle boolean values
            if (typeof formattedData[key] === 'boolean') {
                data.append(key, formattedData[key].toString());
            }
            // Handle all other fields
            else if (formattedData[key] !== null && formattedData[key] !== undefined) {
                data.append(key, formattedData[key]);
            }
        });

        // Add selfie if exists
        if (selfieFile) {
            data.append('selfie', selfieFile);
        }
        
        try {
            console.log('Sending registration data:', Object.fromEntries(data.entries())); // For debugging
            const result = await registerTeacher(data);
            
            if (result.access_token) {
                login(result.access_token, 'teacher');
                
                toast({
                    title: "Success",
                    description: "Registration successful! Welcome.",
                });
                
                // Use replace: true to prevent back navigation and ensure clean URL
                window.location.href = '/teacher/dashboard';
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Registration failed. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTermsDecline = () => {
        setShowTermsDialog(false);
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Registration</h1>
                    <p className="text-gray-600 mt-2">Create your teaching account</p>
                </div>
                <Card className="shadow-lg border-gray-200">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Personal Details Section */}
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Details</h3>
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
                                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                                    <Input id="whatsappNumber" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                    <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender *</Label>
                                    <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Address Details Section */}
                            <h3 className="text-lg font-semibold border-b pb-2 mt-6 mb-4">Address Details</h3>
                            <div className="space-y-2">
                                <Label htmlFor="fullAddress">Full Address *</Label>
                                <Textarea id="fullAddress" name="fullAddress" value={formData.fullAddress} onChange={handleChange} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="district">District *</Label>
                                    <Input id="district" name="district" value={formData.district} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State *</Label>
                                    <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pinCode">PIN Code *</Label>
                                    <Input id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleChange} required />
                                </div>
                            </div>

                            {/* Academic Details Section */}
                            <h3 className="text-lg font-semibold border-b pb-2 mt-6 mb-4">Academic & Professional Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subjects">Subjects You Teach *</Label>
                                    <Input id="subjects" name="subjects" placeholder="e.g., Physics, Mathematics" value={formData.subjects} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="classes">Classes You Teach *</Label>
                                    <Input id="classes" name="classes" placeholder="e.g., 9th, 10th, 12th" value={formData.classes} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="board">Primary Board *</Label>
                                    <Input id="board" name="board" placeholder="e.g., CBSE, ICSE" value={formData.board} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="university">Highest Qualification/University *</Label>
                                    <Input id="university" name="university" value={formData.university} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="socialLinks">Social Media Links (Optional)</Label>
                                <Input id="socialLinks" name="socialLinks" placeholder="e.g., LinkedIn, YouTube" value={formData.socialLinks} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="selfie">Profile Photo (Optional)</Label>
                                <Input id="selfie" name="selfie" type="file" accept="image/*" onChange={handleFileChange} />
                            </div>

                            {/* Payment Section */}
                            <div className="flex items-center space-x-2 pt-4">
                                <Switch
                                    id="requiresOnlinePayment"
                                    checked={formData.requiresOnlinePayment}
                                    onCheckedChange={(checked) => handleSelectChange('requiresOnlinePayment', checked)}
                                />
                                <Label htmlFor="requiresOnlinePayment">Enable Online Payment Service (Optional)</Label>
                            </div>

                            {formData.requiresOnlinePayment && (
                                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md space-y-4 mt-4">
                                    <h3 className="font-semibold text-lg">Bank Details for Payments</h3>
                                    <p className="text-sm text-gray-600">These details are required to receive payments. All fields are mandatory if this option is enabled.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bankAccountNumber">Bank Account Number *</Label>
                                            <Input id="bankAccountNumber" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} required={formData.requiresOnlinePayment} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ifscCode">IFSC Code *</Label>
                                            <Input id="ifscCode" name="ifscCode" value={formData.ifscCode} onChange={handleChange} required={formData.requiresOnlinePayment} />
                                        </div>
                                        {/* You can add the rest of the bank fields here if needed */}
                                    </div>
                                </div>
                            )}
                            
                            <div className="pt-6">
                               <Button type="submit" className="w-full" disabled={isLoading}>
                                   {isLoading ? 'Registering...' : 'Create Account'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <TermsAndConditionsDialog isOpen={showTermsDialog} onAccept={handleTermsAccept} onDecline={handleTermsDecline} />
        </div>
    );
};

export default TeacherRegister;
