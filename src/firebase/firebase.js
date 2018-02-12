import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
    apiKey: "AIzaSyD0fP4Ivml5voD_Kw0tpLmGhz7vjPXKz38",
    authDomain: "beforeweleave-22694.firebaseapp.com",
    databaseURL: "https://beforeweleave-22694.firebaseio.com"
});

export const db = firebaseApp.database();