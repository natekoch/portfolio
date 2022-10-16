<script>
	import shuffle from 'lodash.shuffle';
	import Gallery from 'svelte-image-gallery';
	import photos from './photos.json';
	let photos_list = [];

	photos_list = shuffle(photos).slice(0,100);
</script>

<style>
	img:hover { transform: scale(1.04); }
</style>

<body>
	<Gallery gap="10" maxColumnWidth="200">
		<img src={photos_list[0].url} alt={photos_list[0].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[1].url} alt={photos_list[1].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[2].url} alt={photos_list[2].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[3].url} alt={photos_list[3].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[4].url} alt={photos_list[4].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[5].url} alt={photos_list[5].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[6].url} alt={photos_list[6].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[7].url} alt={photos_list[7].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[8].url} alt={photos_list[8].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[9].url} alt={photos_list[9].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[10].url} alt={photos_list[10].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[11].url} alt={photos_list[11].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[12].url} alt={photos_list[12].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[13].url} alt={photos_list[13].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[14].url} alt={photos_list[14].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[15].url} alt={photos_list[15].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[16].url} alt={photos_list[16].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[17].url} alt={photos_list[17].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[18].url} alt={photos_list[18].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[19].url} alt={photos_list[19].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[20].url} alt={photos_list[20].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[21].url} alt={photos_list[21].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[22].url} alt={photos_list[22].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[23].url} alt={photos_list[23].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[24].url} alt={photos_list[24].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[25].url} alt={photos_list[25].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[26].url} alt={photos_list[26].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[27].url} alt={photos_list[27].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[28].url} alt={photos_list[28].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[29].url} alt={photos_list[29].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[30].url} alt={photos_list[30].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[31].url} alt={photos_list[31].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[32].url} alt={photos_list[32].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[33].url} alt={photos_list[33].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[34].url} alt={photos_list[34].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[35].url} alt={photos_list[35].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[36].url} alt={photos_list[36].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[37].url} alt={photos_list[37].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[38].url} alt={photos_list[38].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[39].url} alt={photos_list[39].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[40].url} alt={photos_list[40].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[41].url} alt={photos_list[41].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[42].url} alt={photos_list[42].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[43].url} alt={photos_list[43].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[44].url} alt={photos_list[44].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[45].url} alt={photos_list[45].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[46].url} alt={photos_list[46].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[47].url} alt={photos_list[47].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[48].url} alt={photos_list[48].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[49].url} alt={photos_list[49].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[50].url} alt={photos_list[50].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[51].url} alt={photos_list[51].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[52].url} alt={photos_list[52].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[53].url} alt={photos_list[53].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[54].url} alt={photos_list[54].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[55].url} alt={photos_list[55].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[56].url} alt={photos_list[56].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[57].url} alt={photos_list[57].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[58].url} alt={photos_list[58].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[59].url} alt={photos_list[59].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[60].url} alt={photos_list[60].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[61].url} alt={photos_list[61].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[62].url} alt={photos_list[62].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[63].url} alt={photos_list[63].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[64].url} alt={photos_list[64].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[65].url} alt={photos_list[65].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[66].url} alt={photos_list[66].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[67].url} alt={photos_list[67].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[68].url} alt={photos_list[68].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[69].url} alt={photos_list[69].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[70].url} alt={photos_list[70].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[71].url} alt={photos_list[71].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[72].url} alt={photos_list[72].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[73].url} alt={photos_list[73].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[74].url} alt={photos_list[74].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[75].url} alt={photos_list[75].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[76].url} alt={photos_list[76].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[77].url} alt={photos_list[77].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[78].url} alt={photos_list[78].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[79].url} alt={photos_list[79].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[80].url} alt={photos_list[80].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[81].url} alt={photos_list[81].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[82].url} alt={photos_list[82].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[83].url} alt={photos_list[83].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[84].url} alt={photos_list[84].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[85].url} alt={photos_list[85].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[86].url} alt={photos_list[86].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[87].url} alt={photos_list[87].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[88].url} alt={photos_list[88].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[89].url} alt={photos_list[89].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[90].url} alt={photos_list[90].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[91].url} alt={photos_list[91].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[92].url} alt={photos_list[92].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[93].url} alt={photos_list[93].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[94].url} alt={photos_list[94].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[95].url} alt={photos_list[95].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[96].url} alt={photos_list[96].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[97].url} alt={photos_list[97].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[98].url} alt={photos_list[98].title} class="w-full hover:shadow-inner shadow-xl pt-10">
		<img src={photos_list[99].url} alt={photos_list[99].title} class="w-full hover:shadow-inner shadow-xl pt-10">

	</Gallery>
</body>