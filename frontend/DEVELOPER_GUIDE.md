# 🚀 LMS Frontend Developer Guide

## 📁 **New Folder Structure (Beginner-Friendly)**

```
frontend/src/
├── 📱 pages/                    # Main pages users see
│   └── auth/                   # Authentication pages
│       └── ForgotPassword.jsx
├── 🧩 components/              # Reusable UI components
│   ├── auth/                   # Authentication components
│   │   ├── Login.jsx
│   │   └── ForgotPassword.jsx
│   ├── dashboard/              # Dashboard components
│   │   ├── TeacherDashboard.jsx
│   │   └── StudentDashboard.jsx
│   ├── forms/                  # Form components
│   │   ├── AddBatchDialog.jsx
│   │   ├── AddPaymentDialog.jsx
│   │   ├── AddStudentDialog.jsx
│   │   ├── BankAccountDetailsDialog.jsx
│   │   └── TermsAndConditionsDialog.jsx
│   ├── layout/                 # Layout components
│   │   ├── ResponsiveLayout.jsx
│   │   └── MobileNavigation.jsx
│   ├── shared/                 # Shared components
│   │   └── PaymentSummary.jsx
│   ├── student/                # Student-specific components
│   │   ├── StudentAttendance.jsx
│   │   ├── StudentBatchView.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── StudentDialogs.jsx
│   │   ├── StudentMaterials.jsx
│   │   ├── StudentPayments.jsx
│   │   ├── StudentRegister.jsx
│   │   └── StudentSettings.jsx
│   ├── teacher/                # Teacher-specific components
│   │   ├── TeacherAttendance.jsx
│   │   ├── TeacherBatches.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── TeacherDashboardOverview.jsx
│   │   ├── TeacherMaterials.jsx
│   │   ├── TeacherNotifications.jsx
│   │   ├── TeacherPayments.jsx
│   │   ├── TeacherRegister.jsx
│   │   ├── TeacherSettings.jsx
│   │   └── TeacherStudents.jsx
│   └── ui/                     # UI components (Radix UI)
│       ├── button.jsx
│       ├── card.jsx
│       ├── dialog.jsx
│       └── ... (many more)
├── 🔌 services/                # Backend API services
│   ├── api.js                  # Base API configuration
│   ├── authService.js          # Authentication API calls
│   ├── studentService.js       # Student API calls
│   ├── teacherService.js       # Teacher API calls
│   └── index.js                # Export all services
├── 📊 data/                    # Mock data (replace with backend)
│   ├── teachers.js             # Teacher mock data
│   ├── students.js             # Student mock data
│   ├── batches.js              # Batch mock data
│   ├── payments.js             # Payment mock data
│   ├── attendance.js           # Attendance mock data
│   ├── materials.js            # Materials mock data
│   ├── notifications.js        # Notifications mock data
│   └── index.js                # Export all data
├── 🔗 contexts/                # Global state management
│   └── AuthContext.jsx         # Authentication context
├── 🛠️ hooks/                   # Custom React hooks
│   └── use-toast.js            # Toast notifications
├── 📚 utils/                   # Helper functions
├── 📋 types/                   # TypeScript definitions (future)
├── 🎨 styles/                  # CSS and styling
│   └── components.css          # Component styles
├── lib/                        # Library configurations
│   ├── theme.js                # Theme configuration
│   └── utils.js                # Utility functions
├── App.jsx                     # Main app component
├── App.css                     # Main app styles
├── index.jsx                   # App entry point
├── index.css                   # Global styles
└── README.md                   # This guide
```

## 🎯 **How to Use This Structure**

### ✅ **For Beginners:**

1. **Want to add a new page?** → Put it in `pages/`
2. **Want to add a new component?** → Put it in `components/`
3. **Want to connect to backend?** → Use `services/`
4. **Want to add mock data?** → Put it in `data/`

### 🔌 **Backend Integration:**

1. **Replace mock data** in `data/` folder with real API calls
2. **Use services** in `services/` folder for all backend communication
3. **Update API URLs** in `services/api.js`
4. **Add authentication** using `services/authService.js`

### 📱 **Component Organization:**

- **`auth/`** - Login, registration, password reset
- **`dashboard/`** - Main dashboard components
- **`forms/`** - All form dialogs and inputs
- **`layout/`** - Navigation, headers, footers
- **`shared/`** - Components used by multiple features
- **`student/`** - Student-specific features
- **`teacher/`** - Teacher-specific features
- **`ui/`** - Basic UI components (buttons, cards, etc.)

## 🚀 **Quick Start Guide**

### 1. **Development Setup:**
```bash
cd frontend
npm install
npm start
```

### 2. **Add New Feature:**
```bash
# Create new component
touch src/components/MyNewComponent.jsx

# Create new service
touch src/services/myNewService.js

# Create new page
touch src/pages/MyNewPage.jsx
```

### 3. **Connect to Backend:**
```javascript
// In your component
import { studentService } from '../services';

// Replace mock data with API calls
const students = await studentService.getAllStudents();
```

## 📚 **File Naming Conventions**

### ✅ **Good Names:**
- `StudentDashboard.jsx` - Clear, descriptive
- `AddBatchDialog.jsx` - Action + object
- `PaymentSummary.jsx` - Feature + type

### ❌ **Bad Names:**
- `Component1.jsx` - Not descriptive
- `test.jsx` - Too generic
- `stuff.jsx` - Not clear

## 🔧 **Development Tips**

### 1. **Keep Components Small:**
- Each component should do one thing
- If it's over 200 lines, consider splitting it

### 2. **Use Services for API Calls:**
- Don't put API calls directly in components
- Use the `services/` folder for all backend communication

### 3. **Follow the Folder Structure:**
- Put files in the right folder
- Don't mix different types of components

### 4. **Document Your Code:**
- Add comments explaining complex logic
- Use descriptive variable names

## 🚨 **Common Mistakes to Avoid**

1. **Don't put API calls in components** - Use services instead
2. **Don't mix UI and business logic** - Keep them separate
3. **Don't create files without clear purpose** - Follow the structure
4. **Don't hardcode API URLs** - Use environment variables

## 🎉 **Success Tips**

1. **Start small** - Add one feature at a time
2. **Test often** - Make sure everything works
3. **Ask questions** - Don't be afraid to ask for help
4. **Follow the structure** - It's designed to help you

---

## 📞 **Need Help?**

- Check the `README.md` in each folder
- Look at existing components for examples
- Ask questions in the team chat
- Review this guide when in doubt

**Happy Coding! 🚀**
