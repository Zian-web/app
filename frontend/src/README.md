# 📚 LMS Frontend Structure Guide

## 🎯 **For Beginners - How to Navigate This Project**

### 📁 **Folder Structure Explained**

```
src/
├── 📱 pages/           # Main pages (what users see)
├── 🧩 components/      # Reusable UI pieces
├── 🔧 services/       # Backend communication
├── 📊 data/           # Mock data (will be replaced by backend)
├── 🎨 styles/         # CSS and styling
├── 🔗 contexts/       # Global state management
├── 🛠️ hooks/         # Custom React hooks
├── 📚 utils/          # Helper functions
└── 📋 types/          # TypeScript definitions (future)
```

### 🚀 **How to Add New Features**

1. **New Page?** → Add to `pages/`
2. **New Component?** → Add to `components/`
3. **Backend API?** → Add to `services/`
4. **New Data Type?** → Add to `types/`

### 🔗 **Backend Integration Ready**

- All API calls go in `services/`
- Easy to replace mock data with real API calls
- Clear separation between frontend and backend logic

### 📖 **Quick Start**

1. **Start Development**: `npm start`
2. **Build for Production**: `npm run build`
3. **Add New Component**: Create in `components/` folder
4. **Connect to Backend**: Use `services/` folder

---

## 🏗️ **Architecture Overview**

### 🎨 **Frontend Structure**
- **React 18** with modern hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Radix UI** for accessible components

### 🔌 **Backend Integration**
- **API Services** in `services/` folder
- **Mock Data** in `data/` folder (replace with real APIs)
- **Context** for global state management
- **Hooks** for reusable logic

### 📱 **User Roles**
- **Teachers**: Manage batches, students, materials
- **Students**: View materials, track attendance, make payments

---

## 🛠️ **Development Guidelines**

### ✅ **Do's**
- Keep components small and focused
- Use TypeScript for better code quality
- Follow naming conventions
- Document your code

### ❌ **Don'ts**
- Don't put business logic in components
- Don't hardcode API URLs
- Don't mix UI and data logic
- Don't create files without clear purpose

---

## 🚀 **Next Steps**

1. **Learn React**: Start with components in `components/`
2. **Understand State**: Check `contexts/AuthContext.jsx`
3. **Add Features**: Follow the folder structure
4. **Connect Backend**: Use `services/` for API calls

---

*Happy Coding! 🎉*
