let ghpages = require('gh-pages');

ghpages.publish(
    '/public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/natekoch/portfolio.git',
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