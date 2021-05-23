import firebase from 'firebase';

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyBEvlUiaOaeCtQr6RzfbcHbe4H6mB3CEIM",
    authDomain: "opengames-15140.firebaseapp.com",
    projectId: "opengames-15140",
    storageBucket: "opengames-15140.appspot.com",
    messagingSenderId: "491351047613",
    appId: "1:491351047613:web:761133b35d09eba54f66d4",
    measurementId: "G-S0DD75Z4HC"
});

const db = firebaseConfig.firestore();

export {db};