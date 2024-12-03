# Patient History with Firebase

This project is a patient management application built with React and Firebase, allowing you to view, add, and delete patients, treatments, and feedbacks. The application includes password-based authentication, and data is stored in Firebase Firestore with a password prefix for added security.

# My Deploy

[Patient Management - Deploy](https://patient-history-8hk4q7gl7-diabosmais22gmailcoms-projects.vercel.app/)

## Features

- **Patient Management**: Add, view, and delete patients.
- **Treatment Management**: Add and view treatments for patients.
- **Feedback Management**: Add and view feedback for patients.
- **Password Protection**: The database is accessed with a password, which can be stored in `localStorage` for persistence.
- **Confirmation Modal**: A confirmation modal is shown before deleting patients to ensure no accidental data removal.
  
## Technologies Used

- **React**: JavaScript library for building the user interface.
- **Firebase Firestore**: NoSQL database for storing patients, treatments, and feedbacks.
- **Firebase SDK**: For CRUD operations on Firestore.
- **Tailwind CSS**: A CSS framework for quick, responsive styling.
- **Lucide React**: A lightweight icon library for React.
- **UI Components**: Custom UI components such as Dialog, Sheet, Tabs, and Avatar.

## How to Run the Project

### Prerequisites

- Node.js (version 14 or higher)
- Firebase SDK configured for the project
- Yarn or npm installed globally

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/LuizBrugnera/patient-history.git

2. Env Variables
 
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID
