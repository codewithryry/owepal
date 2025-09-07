import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBi8UaKnTZ7IGWJjmsZkGtE-iVWZYBxVpk',
  authDomain: 'budgetbuddy-4eb85.firebaseapp.com',
  projectId: 'budgetbuddy-4eb85',
  storageBucket: 'budgetbuddy-4eb85.appspot.com',
  messagingSenderId: '273269652753',
  appId: '1:273269652753:web:bfa4d10ae1b89d82a120b0',
  measurementId: 'G-6QLK9QERPG',
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

// Export the services
export { db, storage, auth }
