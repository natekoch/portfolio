const production = !process.env.ROLLUP_WATCH;
module.exports = {
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
     "./public/index.html"
    ],
    enabled: production // disable purge in dev
  },
};