<script>
	import Blog from "./Blog.svelte";
	import Home from "./Home.svelte";
	import About from "./About.svelte";
	import Contact from "./Contact.svelte";
	import Photography from "./Photography.svelte";
	import Programming from "./Programming.svelte";

	let menu = 1;
</script>

<main>
	<nav class="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
		<div class="px-2 mx-2 navbar-start">
			<span class="text-lg font-bold">
				nate koch
			</span>
		</div> 
		<div class="hidden px-2 mx-2 navbar-center lg:flex">
			<div class="flex items-stretch">
				<button class="btn btn-ghost btn-sm rounded-btn" on:click|preventDefault={() => (menu = 1)}>
					Home
				</button> 
				<button class="btn btn-ghost btn-sm rounded-btn" on:click|preventDefault={() => (menu = 2)}>
					Photography
				</button> 
				<button class="btn btn-ghost btn-sm rounded-btn" on:click|preventDefault={() => (menu = 3)}>
					Programming
				</button> 
				<button class="btn btn-ghost btn-sm rounded-btn" on:click|preventDefault={() => (menu = 4)}>
					Blog
				</button> 
				<button class="btn btn-ghost btn-sm rounded-btn" on:click|preventDefault={() => (menu = 5)}>
					About
				</button> 
				<button class="btn btn-ghost btn-sm rounded-btn" on:click|preventDefault={() => (menu = 6)}>
					Contact
				</button> 
			</div>
		</div> 
		<div class="navbar-end">
			<button class="btn btn-square btn-ghost">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">             
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>             
				</svg>
			</button>
		</div>
	</nav>
	{#if menu === 1} 
		<Home />
	{:else if menu === 2}
		<Photography />
	{:else if menu === 3}
		<Programming />
	{:else if menu === 4}
		<Blog />
	{:else if menu === 5}
		<About />
	{:else if menu === 6}
		<Contact />
	{:else}
		<h1>
			Page Not Found
		</h1>
	{/if}
</main>

<style>
</style>