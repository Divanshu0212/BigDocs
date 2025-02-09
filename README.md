# 🏥 Telemedicine & Healthcare Platform

## 📌 Overview
This is a **full-fledged Telemedicine and Healthcare Management Platform** that connects **patients** and **doctors** through virtual consultations, appointment booking, medical report uploads, and a community forum for discussions. It also includes a symptom checker and medication management system.

---

## 🌟 Features

### **🔹 Authentication & User Roles**
- **Google Authentication** for seamless login
- Users are categorized into **Doctors** and **Patients**
- **Doctors** can **view** patient posts and appointments
- **Patients** can **book** appointments, **upload** reports, and **participate** in discussions

### **🔹 Patient Features**
- **🩺 Book Appointments:** Easily schedule appointments with available doctors
- **💬 Community Forum:** Post queries and interact with other patients
- **📁 Upload & View Reports:** Upload medical reports for doctors to review
- **📌 Symptom Checker:** 
  - AI-driven symptom analysis to suggest possible conditions
  - Currently using a lightweight model (MVP version)
  - Larger, more accurate model in development
- **📹 Telemedicine Consultations:** Secure video call link generated when a doctor accepts an appointment

### **🔹 Doctor Features**
- **📅 Manage Appointments:** Accept or reject patient bookings
- **🗂️ View Patient Reports:** Access and review uploaded reports
- **📝 Medication Editor:** Prescribe and update medications
- **👥 Patient List:** View all assigned patients
- **👨‍⚕️ Telemedicine Interface:** Join video consultations with patients

---

## 🛠️ Tech Stack

| Category            | Technology           |
|--------------------|---------------------|
| **Frontend**       | React.js, Tailwind CSS, Lucide-React (icons) |
| **Backend**        | Firebase Authentication, Firestore, Python |
| **Video Calls**    | Secure Telemedicine Room System |
| **Deployment**     | Vercel (Frontend), Firebase Hosting (Backend), Hugging Face (Model Deployment) |

---

## 🤖 AI Model Details

### Current Implementation
- Using a smaller parameter model for the hackathon due to time constraints
- Trained on a curated medical dataset for basic symptom analysis
- Sufficient for MVP demonstration

### Future Roadmap
- Training a larger, more comprehensive model with:
  - Increased parameter count for better accuracy
  - Broader medical dataset coverage
  - More sophisticated symptom analysis capabilities
  - Enhanced diagnostic suggestions
- Implementation of advanced NLP techniques for better understanding of patient descriptions
- Integration with medical knowledge bases for more accurate predictions

---

## 🔄 Workflow

### **1️⃣ User Registration & Authentication**
- Users sign up via **Google Authentication**
- Firebase assigns roles based on registration input

### **2️⃣ Patient Workflow**
1. Patient logs in and accesses **Dashboard**
2. Books an appointment with an available doctor
3. Uploads necessary medical reports
4. Waits for doctor's acceptance (Telemedicine link generated upon approval)
5. Joins **Telemedicine Consultation** via a secure link
6. Receives prescribed medication and treatment plan

### **3️⃣ Doctor Workflow**
1. Doctor logs in and accesses **Dashboard**
2. Reviews **patient appointment requests**
3. Accepts/Rejects appointments
4. Views **patient reports** for better diagnosis
5. Joins **Telemedicine Consultation** through a secure link
6. Prescribes medications and provides follow-up instructions

### **4️⃣ Community Forum**
- **Patients** can post health-related questions
- **Doctors** can view posts but cannot create new ones

---

## 🚀 Getting Started

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Set Up Firebase**
- Create a Firebase project
- Enable **Firestore Database** and **Authentication (Google Sign-In)**
- Add Firebase Config to `.env.local`

### **4️⃣ Start the Development Server**
```bash
npm run dev
```

---

## 📸 Screenshots
(Add relevant screenshots here)
![Screenshot 2025-02-09 010743](https://github.com/user-attachments/assets/44f84456-7d6e-4d26-b165-a55b32735670)
![Screenshot 2025-02-09 010751](https://github.com/user-attachments/assets/a22cd5b8-4d53-4258-9d88-53ed3d4b7ec9)

![Screenshot 2025-02-09 010807](https://github.com/user-attachments/assets/9ac47018-f46b-4288-ac7b-4d2b66ffd766)

![Screenshot 2025-02-09 010818](https://github.com/user-attachments/assets/ad57ed97-b5d7-4b7e-aae8-ac1f9884c4b1)
![image](https://github.com/user-attachments/assets/b25d086c-92be-4fc4-9152-d031e21f2ef5)

![Screenshot 2025-02-09 012422](https://github.com/user-attachments/assets/e76bdd9d-1cb7-4181-9d7d-4f3b5bc0de2d)
![Screenshot 2025-02-09 012432](https://github.com/user-attachments/assets/3c0e670d-4061-4265-b2d0-cb4efd4cbac1)
![Screenshot 2025-02-09 012532](https://github.com/user-attachments/assets/09f7fefa-ab33-4b48-9c53-8b03e01ccdd5)
![Screenshot 2025-02-09 012547](https://github.com/user-attachments/assets/a6676b19-5f70-4976-9349-31b068bef6c4)
![Screenshot 2025-02-09 052014](https://github.com/user-attachments/assets/e63062b1-83ad-4697-930c-2cf8bf4a180f)
![Screenshot 2025-02-09 052403](https://github.com/user-attachments/assets/9083d41b-6e1a-4d6c-834b-58fe45d492d1)
![image](https://github.com/user-attachments/assets/c4dce297-ed1c-4cef-a9dd-04a3d6084ad8)

---

## 📌 Deployment
Deployed on **Vercel**: [Live Demo](https://big-docs.vercel.app/)

---

## 🤝 Contributing
Feel free to fork this repo and submit pull requests!

---

## 📜 License
MIT License © 2025 Your Name
