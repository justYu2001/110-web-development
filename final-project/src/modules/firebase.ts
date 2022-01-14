import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '@/configs/firebase-config';

const app = initializeApp(firebaseConfig);


const firestore = getFirestore(app);

const storage = getStorage(app);

const auth = getAuth();

export {
    firestore,
    storage,
    auth,
};