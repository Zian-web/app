import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authService } from "../../services/authService";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getCurrentUser();
        setStudent(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching profile: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={student?.full_name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={student?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue={student?.phone_number} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input id="whatsapp" type="tel" defaultValue={student?.whatsapp_number} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" defaultValue={student?.date_of_birth?.split('T')[0]} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" defaultValue={student?.gender} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Full Address</Label>
              <Input id="address" defaultValue={student?.full_address} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pin Code</Label>
              <Input id="pincode" defaultValue={student?.pin_code} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input id="class" defaultValue={student?.student_class} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" defaultValue={student?.year} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution Name</Label>
              <Input id="institution" defaultValue={student?.institution_name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent's Name</Label>
              <Input id="parentName" defaultValue={student?.parents_name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent's Phone</Label>
              <Input id="parentPhone" type="tel" defaultValue={student?.parents_phone} />
            </div>
          </div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
