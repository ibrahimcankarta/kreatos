import { $f7 } from 'framework7-vue';
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'Kreatos',
		message:'world',
		expText: 'Hi Guys! this is my personal web site, made with "svelte" and lots of fun. I am half developer and half designer. if you want to cantact with me, scroll the end! Peace out::',
		src : '/self.jpg',
		entry: "Yeah yeah yeah, i know it's boring to looking at someone's web site especially he/she is a developer. Maybe it can be fun, maybe i can do it.  ",
		drummers:"So, why not?"
	}

	
	
});
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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


export default app;