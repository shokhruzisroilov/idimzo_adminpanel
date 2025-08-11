import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: 'AIzaSyCfcMiC5cNHYXh8YgZadt24O8qSrfXZkng',
	authDomain: 'imzo-2edfa.firebaseapp.com',
	projectId: 'imzo-2edfa',
	storageBucket: 'imzo-2edfa.appspot.com',
	messagingSenderId: '218557214026',
	appId: '1:218557214026:web:937d57d63ed9af1c3425b3',
	measurementId: 'G-VC51N3MT25',
}

// 🔹 Firebase init
const app = initializeApp(firebaseConfig)

// 🔹 Firestore & Storage export
export const db = getFirestore(app)
export const storage = getStorage(app)
