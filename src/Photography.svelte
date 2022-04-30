<script>
	import photos from './photos.json';
</script>

<body>
    <div class="pt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {#each photos as photo}
            <a href={photo.url}>
		        <img src={photo.url} alt={photo.title} class="rounded shadow-xl">
            </a>
	    {:else}
		    <!-- this block renders when photos.length === 0 -->
		    <p>loading...</p>
	    {/each}
    </div>
</body>