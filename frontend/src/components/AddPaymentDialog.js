import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const AddPaymentDialog = ({ students, batches, onAddPayment }) => {
  const [studentId, setStudentId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [paymentFrequency, setPaymentFrequency] = useState('One Time');

  const handleSubmit = () => {
    onAddPayment({ studentId, batchId, amount, dueDate, paymentMethod, paymentFrequency });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Payment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="student">Student</Label>
            <Select onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="batch">Batch</Label>
            <Select onValueChange={setBatchId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select onValueChange={setPaymentMethod} defaultValue="Online">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentFrequency">Payment Frequency</Label>
            <Select onValueChange={setPaymentFrequency} defaultValue="One Time">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="One Time">One Time</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit}>Save Payment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;