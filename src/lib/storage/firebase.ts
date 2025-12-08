
// import firebaseConfig from '@/lib/storage/firebaseConfig'
// import admin from 'firebase-admin'

// Stub implementations to satisfy build
export async function getFirebaseObject(Key: string) {
    console.warn('Firebase storage is not configured.');
    return null;
}

export async function uploadFirebaseObject(file: { name: string; type: string }) {
    console.warn('Firebase storage is not configured.');
    return null;
}
