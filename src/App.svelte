<script>
import { HtmlTag } from "svelte/internal";

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
	}

	function buttonFire(){
		
	}

	let user = { loggedIn: false };

	function toggle() {
		user.loggedIn = !user.loggedIn;
	}
</script>



<!--  if you looking in here, please follow this link! : https://www.youtube.com/watch?v=GoLJJRIWCLU this is my fav song to listen. With this song, web site is cooler than actually is. Hope you enjoy! -->
<main>
	
	<img src= {src} class="headImg" alt="self portrait">
	<h3> -this is {name}- </h3>
	<h1>Hello {message}!</h1>
	<p>/* {expText} */</p>
	<p>{ entry }</p>
	 <h2>{drummers}</h2> 
	 <h3> Let's start with basic </h3>
	 <p> if i use svelte, it must have meaning. this all text are came from 'props' don't you believe? look to the source.   </p>

	 <!-- Reactivity -->

	 <button class="dummyButton" on:click="{handleClick}"> Click this button! {count===0 ? 'nobody clicked this button yet :( ' : ' to make this button happy!' } </button>
	 <p> people clicked this button {count} times!     </p> <!-- Reactivity -->
	 <button id="buttonFire" on:click={buttonFire} >Button Fire</button>


	 <h3>or try this!</h3>
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









	 <h3 class="links">here's my links!</h3>

	 <a href="https://www.twitter.com/ibrahimcankarta"> <img src="tw-logo.png" class="tw-logo" alt="twitter logo"> </a>

	 <a href="https://www.github.com/ibrahimcankarta"> <img src="github.png" class="logo" alt="github logo"> </a>

	 <a href="https://www.linkedin.com/in/ibrahimcankarta"> <img src="linkedin.png" class="logo" alt="linkedin logo"> </a>

	 
	 
	<p> /* Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps. */</p>
</main>

<style>
	

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
	.dummyButton:hover{
		background-color: black;
		color: blanchedalmond;
	}
	.dummyButton2:hover{
		background-color: black;
		color: blanchedalmond;
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
</style>