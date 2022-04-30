<script context="module">

    import Home from './Home.svelte';
    import Photography from './Photography.svelte';
    import Programming from './Programming.svelte';
    import Blog from  './Blog.svelte';
    import About from './About.svelte';
    import Contact from './Contact.svelte';

    export const navOptions = [
        { page: 'Homepage', component: Home },
        { page: 'Photography (WIP)', component: Photography },
        { page: 'Programming', component: Programming },
        { page: 'Blog (WIP)', component: Blog },
        { page: 'About Me', component: About },
        { page: 'Contact Me', component: Contact }
    ];
    
</script>