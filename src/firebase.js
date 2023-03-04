import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDkThWneb6Pd0J2r86PBWTAqVdlZ5K0YRQ',
    authDomain: 'project-11ef8.firebaseapp.com',
    projectId: 'project-11ef8',
    storageBucket: 'project-11ef8.appspot.com',
    messagingSenderId: '502363466928',
    appId: '1:502363466928:web:3e474bbf8e8458bd54df75',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
