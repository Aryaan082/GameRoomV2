import * as React from 'react';
import ReactDOM from 'react-dom';
import Main from './screens/main';
import * as Firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBEvlUiaOaeCtQr6RzfbcHbe4H6mB3CEIM",
    authDomain: "opengames-15140.firebaseapp.com",
    projectId: "opengames-15140",
    storageBucket: "opengames-15140.appspot.com",
    messagingSenderId: "491351047613",
    appId: "1:491351047613:web:761133b35d09eba54f66d4",
    measurementId: "G-S0DD75Z4HC"
  };

Firebase.initializeApp(firebaseConfig);

ReactDOM.render(
    <Main />,
    document.getElementById('root')
);