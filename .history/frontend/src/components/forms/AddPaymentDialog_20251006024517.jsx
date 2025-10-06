import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search } from 'lucide-react';

const AddPaymentDialog = ({ students = [], batches = [], onAddPayment = () => {} }) => {
  const [studentId, setStudentId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [paymentFrequency, setPaymentFrequency] = useState('One Time');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) {
      console.log('AddPaymentDialog: students is undefined or not an array:', students);
      return [];
    }
    if (!searchTerm) {
      return students;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return students.filter(student =>
      student.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      student.id.toLowerCase().includes(lowerCaseSearchTerm) ||
      (student.email && student.email.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [students, searchTerm]);

  const handleSubmit = () => {
    // ... validation logic can go here before calling onAddPayment
    onAddPayment({ studentId, batchId, amount, dueDate, paymentMethod, paymentFrequency });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Payment</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="search">Search Student</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setStudentId('');
                }}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select onValueChange={setStudentId} value={studentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 max-h-[200px] overflow-y-auto">
                {filteredStudents.map(student => (
                  <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch">Batch</Label>
            <Select onValueChange={setBatchId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 max-h-[200px] overflow-y-auto">
                {(batches || []).map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input 
              id="amount" 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              className="w-full"
              placeholder="Enter amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Payment Date</Label>
            <Input 
              id="dueDate" 
              type="date" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select onValueChange={setPaymentMethod} defaultValue="Online">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentFrequency">Payment Frequency</Label>
            <Select onValueChange={setPaymentFrequency} defaultValue="One Time">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="One Time">One Time</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="pt-4">
            <Button onClick={handleSubmit} className="w-full">Save Payment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;
