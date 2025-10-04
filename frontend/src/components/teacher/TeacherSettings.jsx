import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { useToast } from '../../hooks/use-toast';
// import { updateMyProfile } from '../../lib/api'; // FIXME: Backend endpoint for profile update does not exist.

const TeacherSettings = () => {
    const { user, setUser } = useAuth();
    const { toast } = useToast();
    const [formData, setFormData] = useState({});

    // This effect runs when the component mounts or the 'user' object changes,
    // populating the form with the most current data.
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.full_name || '',
                email: user.email || '',
                phoneNumber: user.phone_number || '',
                whatsappNumber: user.whatsapp_number || '',
                dateOfBirth: user.date_of_birth || '',
                gender: user.gender || '',
                fullAddress: user.full_address || '',
                district: user.district || '',
                state: user.state || '',
                pinCode: user.pin_code || '',
                subjects: user.subjects || '',
                classes: user.classes || '',
                board: user.board || '',
                university: user.university || '',
                socialLinks: user.social_links || '',
                requiresOnlinePayment: user.requires_online_payment || false,
                bankAccountNumber: user.bank_account_number || '',
                ifscCode: user.ifsc_code || '',
                accountType: user.account_type || '',
                bankName: user.bank_name || '',
                governmentId: user.government_id_url || '',
                permanentAddress: user.permanent_address || '',
                correspondenceAddress: user.correspondence_address || '',
                taxId: user.tax_id || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast({ title: "Feature Disabled", description: "Profile editing is not yet enabled.", variant: "info" });
        // FIXME: Backend endpoint for profile update does not exist.
        /*
        try {
            const updatedUser = await updateMyProfile(formData);
            
            // Update the global user state with the response from the server
            setUser(updatedUser);
            
            toast({
                title: "Success",
                description: "Profile updated successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile. Please try again.",
                variant: "destructive"
            });
        }
        */
    };
    
    // ... The rest of your JSX remains the same
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Card>
                <CardHeader><CardTitle>Edit Profile</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
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
                            <Select name="gender" onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Address Information */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="fullAddress">Full Address</Label>
                            <Textarea id="fullAddress" name="fullAddress" value={formData.fullAddress} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="district">District</Label>
                            <Input id="district" name="district" value={formData.district} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" name="state" value={formData.state} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pinCode">PIN Code</Label>
                            <Input id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleChange} />
                        </div>

                        {/* Academic Information */}
                        <div className="space-y-2">
                            <Label htmlFor="subjects">Subjects</Label>
                            <Input id="subjects" name="subjects" value={formData.subjects} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="classes">Classes</Label>
                            <Input id="classes" name="classes" value={formData.classes} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="board">Board</Label>
                            <Input id="board" name="board" value={formData.board} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="university">University</Label>
                            <Input id="university" name="university" value={formData.university} onChange={handleChange} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="socialLinks">Social Links</Label>
                            <Input id="socialLinks" name="socialLinks" value={formData.socialLinks} onChange={handleChange} />
                        </div>

                        {/* Bank Details */}
                        <div className="space-y-2">
                            <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                            <Input id="bankAccountNumber" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ifscCode">IFSC Code</Label>
                            <Input id="ifscCode" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountType">Account Type</Label>
                            <Input id="accountType" name="accountType" value={formData.accountType} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} />
                        </div>

                        <div className="md:col-span-2 flex items-center justify-end">
                            <Button type="submit" disabled>Save Changes</Button> 
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherSettings;