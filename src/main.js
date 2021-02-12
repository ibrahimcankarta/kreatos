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
 
 
export default app;