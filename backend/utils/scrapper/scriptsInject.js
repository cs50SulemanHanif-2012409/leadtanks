// scheme  , name , URL , injectSource

const scripts = [
    {
        name : 'SEARCH_FILTER_PAGE',
        code : `
            const data = document.querySelectorAll('.reusable-search__entity-result-list')[0].children;
            var result = [];
            for (let item of data) {
                const container = item.children[0].children?.[0].children[0];
               const postAuthorContainer = container.children[2].children?.[0];
               const AuthorLink = postAuthorContainer.href; 
               const AuthorProfileAvatar = postAuthorContainer.querySelector('.lazy-image').src;
               const AuthorName = postAuthorContainer.children?.[2].children?.[0].querySelector('.visually-hidden').innerText;
               result.push({
                AuthorLink,AuthorProfileAvatar,AuthorName
               })
               console.log(postAuthorContainer)
           }
           console.log(result)
        `,
        urlScheme : '/search/results/content/',
        exampleURL : 'https://www.linkedin.com/search/results/content/?datePosted=%22past-week%22&keywords=%23opentowork%20React%20Native&sid=%40Q!'
    },
    {
        name : 'SEARCH_DEFAULT_PAGE',
        code  : `
            const data = document.querySelectorAll(".reusable-search__result-container");
            var result = [];
            data.forEach(item => {
                const container = item.children[0].children?.[0];
                const postAuthorContainer = container?.children?.[0];
                const postTextConatiner = container?.children?.[1];
                const postLikesContainer = container?.children?.[2];
                const PostText = postTextConatiner?.children?.[0].children?.[0].innerText;
                const postLink = postAuthorContainer.children?.[0]?.children?.[0]?.href;
                const postAuthorImage = postAuthorContainer.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]?.src;
                const postAuthorName = postAuthorContainer.children?.[1]?.children?.[0]?.children?.[0]?.children?.[0].innerText;
                const postDate = postAuthorContainer.children?.[1]?.children?.[1]?.children?.[1]?.innerText?.split(" ")[0];
                const postAuthorCaption = postAuthorContainer.children?.[1]?.children?.[1]?.children?.[0]?.innerText;
                const postComments = postLikesContainer?.children?.[0]?.children?.[1]?.children?.[1]?.innerText;
                const postLikes = postLikesContainer?.children?.[0]?.children?.[1]?.children?.[0]?.innerText;
                result.push({
                    PostText,
                    postLink, postAuthorImage, postAuthorName, postDate, postAuthorCaption, postComments, postLikes
                })
            })
            console.log(result)
        
        `,
        urlScheme : '/search/results/all/',
        exampleURL : `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent('#openToWork React Native')}&origin=GLOBAL_SEARCH_HEADER`
    }
]