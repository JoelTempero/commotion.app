// Firebase Configuration for COMMOTION.APP
const firebaseConfig = {
    apiKey: "AIzaSyD3zY_2bziwslkhoECGrvIjqU4x0dYBJKo",
    authDomain: "commotion-app.firebaseapp.com",
    projectId: "commotion-app",
    storageBucket: "commotion-app.firebasestorage.app",
    messagingSenderId: "798500837292",
    appId: "1:798500837292:web:d01d7d702e9f3ee7d44c09",
    measurementId: "G-C5MP25YYSG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Auth state observer
function onAuthStateChange(callback) {
    return auth.onAuthStateChanged(callback);
}

// Sign in with email/password
async function signIn(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message, code: error.code };
    }
}

// Sign out
async function signOut() {
    try {
        await auth.signOut();
        localStorage.clear();
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

// Get current user
function getCurrentUser() {
    return auth.currentUser;
}

// Firestore helpers
const firestoreHelpers = {
    // Get a single document with timeout
    async getDoc(collection, docId) {
        try {
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );
            const fetchPromise = db.collection(collection).doc(docId).get();
            const doc = await Promise.race([fetchPromise, timeoutPromise]);
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error(`Error getting ${collection}/${docId}:`, error);
            throw error;
        }
    },

    // Get all documents in a collection
    async getCollection(collection, orderByField = null, orderDirection = 'asc') {
        try {
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );
            let query = db.collection(collection);
            if (orderByField) {
                query = query.orderBy(orderByField, orderDirection);
            }
            const snapshot = await Promise.race([query.get(), timeoutPromise]);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Error getting collection ${collection}:`, error);
            throw error;
        }
    },

    // Query documents with conditions
    async queryCollection(collection, field, operator, value) {
        try {
            const snapshot = await db.collection(collection)
                .where(field, operator, value)
                .get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Error querying ${collection}:`, error);
            return [];
        }
    },

    // Add a new document
    async addDoc(collection, data) {
        try {
            const docRef = await db.collection(collection).add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error(`Error adding to ${collection}:`, error);
            return { success: false, error: error.message };
        }
    },

    // Update a document
    async updateDoc(collection, docId, data) {
        try {
            await db.collection(collection).doc(docId).update({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error(`Error updating ${collection}/${docId}:`, error);
            return { success: false, error: error.message };
        }
    },

    // Delete a document
    async deleteDoc(collection, docId) {
        try {
            await db.collection(collection).doc(docId).delete();
            return { success: true };
        } catch (error) {
            console.error(`Error deleting ${collection}/${docId}:`, error);
            return { success: false, error: error.message };
        }
    },

    // Set a document (create or overwrite)
    async setDoc(collection, docId, data, merge = true) {
        try {
            await db.collection(collection).doc(docId).set({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge });
            return { success: true };
        } catch (error) {
            console.error(`Error setting ${collection}/${docId}:`, error);
            return { success: false, error: error.message };
        }
    },

    // Real-time listener for a collection
    onCollectionChange(collection, callback, orderByField = null) {
        let query = db.collection(collection);
        if (orderByField) {
            query = query.orderBy(orderByField);
        }
        return query.onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(data);
        });
    },

    // Real-time listener for a document
    onDocChange(collection, docId, callback) {
        return db.collection(collection).doc(docId).onSnapshot(doc => {
            if (doc.exists) {
                callback({ id: doc.id, ...doc.data() });
            } else {
                callback(null);
            }
        });
    }
};

// Export for use
window.firebaseConfig = firebaseConfig;
window.auth = auth;
window.db = db;
window.signIn = signIn;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.onAuthStateChange = onAuthStateChange;
window.firestoreHelpers = firestoreHelpers;
