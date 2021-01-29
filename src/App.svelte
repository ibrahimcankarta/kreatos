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

	 <button on:click="{handleClick}"> Click this button! {count===0 ? 'nobody clicked this button yet :( ' : ' to make this button happy!' } </button>
	 <label>{count===0 ? 'the button is unhappy:(' : "nö" }    </label>
	





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
</style>