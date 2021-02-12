<script>
import { HtmlTag } from "svelte/internal";
	import firebase from "./services/firebase.js"
	export let name;
	export let src;
	export let expText;
	export let message;
	export let entry;
	export let drummers;

	let kod= "You are the <p>{count} </p>'th person to clicked this button! ";
	
	let count =0;
	function handleClick() {
	count += 1;
	const docRef = db.collection('number counter').doc('number');
	docRef.set({
  value:count
	});
	}

	

	const db = firebase.firestore();
	const doc = db.collection('number counter').doc('number');


	const observer = doc.onSnapshot(docSnapshot => {
  	console.log( docSnapshot.data());
		count=docSnapshot.data().value;
  
	}, err => {
  	console.log(`Encountered error: ${err}`);
	});
	

	
	let user = { loggedIn: false };
	console.log(firebase);


	function toggle() {
		user.loggedIn = !user.loggedIn;
	}
</script>


<main>
	<!-- intro-->
	<img src= {src} class="headImg" loading='lazy' alt="self portrait">
	<h3> -this is {name}- </h3>
	<h1>Hello {message}!</h1>
	<p>/* {expText} */</p>
	<p>{ entry }</p>
	 <h2>{drummers}</h2> 
	 <h3> Let's start with basic </h3>
	 <p> if i use svelte, it must have meaning. this all text are came from 'props' don't you believe? look to the source.   </p>
	 

	 <!-- Firebase -->

	 <button class="dummyButton" on:click="{handleClick}"> Click this button! {count===0 ? 'nobody clicked this button yet :( ' : ' to make this button happy!' } </button>
	 <p> people clicked this button {count} times!     </p> 
	 
	 <!-- Firebase -->
	 


	 <h3>or try this!</h3>
	 <!-- Reactivity-->
	 {#if user.loggedIn}
	 <button class="dummyButton2" on:click={toggle}>
		Out
	</button>
		 
	 {/if}

	 	{#if !user.loggedIn}
			<button class="dummyButton2"  on:click={toggle}>
				In
			</button>
		{/if}
	 <!-- Reactivity-->
	 <p>So this is 'Reactivity'  </p>
			<div class="buttonArea">
				<button class='storyIsaac'  >Blurry Eyes <br>*upcoming*</button>
	 			<button class='storyAbout'  >About <br> - the - <br> Stories<br>*upcoming*</button>
	 			<button class='storyOlivia' >Olivia<br>*upcoming*</button>
			</div>
	 <div>
		 <p>...</p>
	 </div>


	 <h3 class="links">here's my links!</h3>

	 <a href="https://www.twitter.com/ibrahimcankarta"> <img src="tw-logo.png" class="tw-logo" alt="twitter logo"> </a>

	 <a href="https://www.github.com/ibrahimcankarta"> <img src="github.png" class="logo" alt="github logo"> </a>

	 <a href="https://www.linkedin.com/in/ibrahimcankarta"> <img src="linkedin.png" class="logo" alt="linkedin logo"> </a>
	 
	 
	 
	<p> /*If you want to learn something about 'svelte' Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a>  */</p>
</main>

<style>
	main{
		font-family: Helvetica;
		scroll-behavior:smooth;
		
	}
	::-webkit-scrollbar{
		width:12px;
		background-color: wheat;
	}
	::-webkit-scrollbar-track{
		border-radius: 3px;
		background-color: transparent;
	}
	::-webkit-scrollbar-thumb{
		border-radius: 5px;
		background-color: black;
		border: 20px solid green;
	}

	.headImg{
		max-width: 420px;
		border-radius:2ch  ;
		
	}
	main {
		text-align: center;
		padding: 1em;
		max-width: 400px;
		margin: 0 auto;
	}

	h1 {
		color: #ff7b00;
		font-size: 4em;
		font-weight: 100;
		margin:auto;
	}
	h3{
		color:rgb(0, 0, 0);
		margin: 0;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}

	}
	.links{
		font-size: 35px;
		margin: 9px;
	}
	.dummyButton{
		width: 420px;
		border-radius: 5px;
		background-color: #ff7b00;
		font-weight: bold;
		margin: 7px;
		
		
	}
	.dummyButton2{
		border-radius: 5px;
		width: 70px;
		background-color: #ff7b00;
		font-weight: bold;
		margin: 7px;
	}
	.buttonArea{
		display:flex;
		justify-content: center;
	}
	.storyIsaac{
		
		border-radius: 5px;
		width:220px ;
		height: 140px ;
		background-color: #ff7b00;
		font-weight:bold;
		margin-right: 7px;
	}
	.storyAbout{
		border-radius: 5px;
		width:220px ;
		height: 140px ;
		background-color: #ff7b00;
		font-weight:bold;
		margin-right:7px;
		margin-left: 7px;
		
	}
	.storyOlivia{
		border-radius: 5px;
		width:220px ;
		height: 140px ;
		background-color: #ff7b00;
		font-weight:bold;
		margin-left: 7px;
	
	}
	.dummyButton:hover{
		background-color: black;
		width: 430px;
		color: blanchedalmond;
		box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.17);
	}
	.dummyButton2:hover{
		box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.17);
		width: 74px;;
		background-color: black;
		color: blanchedalmond;
	}
	.storyIsaac:hover{
		box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.17);
		background-color: black;
		color: blanchedalmond;
		font-size: 18px;
	}
	.storyAbout:hover{
		box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.17);
		background-color: black;
		color: blanchedalmond;
		font-size: 18px;

		
	}
	.storyOlivia:hover{
		box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.17);
		background-color: black;
		color: blanchedalmond;
		font-size: 18px;

		
	}
	.logo{
		max-width: 40px;
		margin-left: 7px;
		margin-right: 7px;
	
		
	}
	.tw-logo{
		max-width: 40px;
		margin-left: 7px;
		margin-right: 7px;
		background-color: black;
		border-radius: 1ch;
	}
	.links{
		margin:7px;
	}
</style>