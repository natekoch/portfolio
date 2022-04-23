import { publish } from 'gh-pages';

publish(
 '/public', // path to public directory
 {
  branch: 'gh-pages',
  repo: 'https://github.com/el3um4s/memento-sveltekit-and-github-pages.git', // Update to point to your repository
  user: {
   name: 'Nate Koch',
   email: 'nkoch@jaaku.xyz'
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);