import firebase from "firebase"



var firebaseConfig = {
  apiKey: "AIzaSyArB1duLFjbbVPelpfuH8XVUcfCNi4WBdM",
  authDomain: "kreatos-853c2.firebaseapp.com",
  projectId: "kreatos-853c2",
  storageBucket: "kreatos-853c2.appspot.com",
  messagingSenderId: "395741123458",
  appId: "1:395741123458:web:01c18579fa4eeffa13f59b",
  measurementId: "G-5L2RQRJ805"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase