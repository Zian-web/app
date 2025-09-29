import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const TermsAndConditionsDialog = ({ isOpen, onAccept, onDecline }) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms and conditions to continue
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-96 w-full rounded-md border p-4">
          <div className="space-y-4 text-sm">
            <h3 className="font-semibold text-base">1. Acceptance of Terms</h3>
            <p>
              By accessing and using this Teacher-Student Management System, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h3 className="font-semibold text-base">2. User Responsibilities</h3>
            <p>
              Users are responsible for maintaining the confidentiality of their account information and password. You agree to accept responsibility for all activities that occur under your account.
            </p>

            <h3 className="font-semibold text-base">3. Data Privacy</h3>
            <p>
              We are committed to protecting your privacy. Personal information collected will be used solely for the purpose of providing educational services and will not be shared with third parties without your consent.
            </p>

            <h3 className="font-semibold text-base">4. Academic Integrity</h3>
            <p>
              All users must maintain academic integrity. Any form of cheating, plagiarism, or academic dishonesty is strictly prohibited and may result in account suspension.
            </p>

            <h3 className="font-semibold text-base">5. Payment Terms</h3>
            <p>
              Students are required to pay fees as per the agreed schedule. Late payments may result in restricted access to certain features until payment is made.
            </p>

            <h3 className="font-semibold text-base">6. Content Usage</h3>
            <p>
              All educational materials provided through this platform are for personal use only. Redistribution, copying, or sharing of materials without permission is prohibited.
            </p>

            <h3 className="font-semibold text-base">7. System Availability</h3>
            <p>
              While we strive to maintain 24/7 availability, we do not guarantee uninterrupted service. Scheduled maintenance and updates may temporarily affect system access.
            </p>

            <h3 className="font-semibold text-base">8. Limitation of Liability</h3>
            <p>
              The platform and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this system.
            </p>

            <h3 className="font-semibold text-base">9. Modifications</h3>
            <p>
              We reserve the right to modify these terms at any time. Users will be notified of significant changes and continued use constitutes acceptance of modified terms.
            </p>

            <h3 className="font-semibold text-base">10. Termination</h3>
            <p>
              We reserve the right to terminate or suspend accounts that violate these terms or engage in inappropriate behavior within the platform.
            </p>

            <h3 className="font-semibold text-base">11. Contact Information</h3>
            <p>
              For questions regarding these terms, please contact our support team through the platform's help section.
            </p>

            <p className="text-xs text-gray-500 mt-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onDecline}>
            Return back to Login
          </Button>
          <Button onClick={onAccept}>
            I Agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionsDialog;
