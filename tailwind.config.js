const production = !process.env.ROLLUP_WATCH;
module.exports = {
  theme: { 
  },
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true, 
  },
  plugins: [
    require('daisyui')
  ],
  purge: {
    content: [
     "./src/App.svelte",
     "./src/Blog.svelte",
     "./src/Contact.svelte",
     "./src/Home.svelte",
     "./src/Programming.svelte",
     "./src/Photography.svelte",
     "./src/About.svelte",
     "./public/index.html"
    ],
    enabled: production // disable purge in dev
  },
};