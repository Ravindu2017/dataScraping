/**
 * Fetches posts from a Reddit subreddit
 * @param {string} subreddit - Subreddit name (without 'r/')
 * @param {string} sortType - 'hot', 'new', 'top', etc.
 * @param {number} limit - Number of posts to fetch (max 100)
 * @returns {Promise<Array>} Array of Reddit posts
 */
async function fetchRedditPosts(subreddit, sortType, limit) {
  if (limit < 100) {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/${sortType}.json?limit=${limit}`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "RedditScraper/0.0.1", // Required by Reddit API
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data.children.map((post) => ({
        id: post.data.id,
        title: post.data.title,
        author: post.data.author,
        score: post.data.score,
        url: post.data.url,
        created_utc: post.data.created_utc,
        num_comments: post.data.num_comments,
      }));
    } catch (error) {
      console.error("Error fetching Reddit data:", error);
      return [];
    }
  } else {
    // Set limit of posts to be only 200
    let allPosts = [];
    let after = "";
    // i cannot be greater than 2
    try {
      for (let i = 0; i < 2; i++) {
        const url = `https://www.reddit.com/r/${subreddit}/${sortType}.json?limit=100&after=${after}`;

        const response = await fetch(url, {
          headers: {
            "User-Agent": "RedditScraper/0.0.1", // Required by Reddit API
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allPosts = [...allPosts, ...data.data.children];
        after = data.data.after;
        await new Promise((r) => setTimeout(r, 2000));
        console.log(i);
        // return data.data.children.map((post) => ({
        //   id: post.data.id,
        //   title: post.data.title,
        //   author: post.data.author,
        //   score: post.data.score,
        //   url: post.data.url,
        //   created_utc: post.data.created_utc,
        //   num_comments: post.data.num_comments,
        // }));
      }

      return allPosts;
    } catch (error) {
      console.error("Error fetching Reddit data:", error);
      return [];
    }
  }
}

// // Fetch Posts in 1 go
fetchRedditPosts("askreddit", "top", 200).then((posts) => {
  console.log(
    "Top Askreddit posts:",
    posts.length,
    posts[0].data.clicked,
    posts[199].data.clicked
  );
  // Display in your webpage:
  //   posts.forEach((post) => {
  //     console.log(
  //       //   post,
  //       //   post.url,
  //       //   post.title,
  //       post.author
  //       //   post.num_comments,
  //       //   post.score
  //     );
  //   });
});

// Bin
// document.body.innerHTML += `
//       <div class="post">
//         <h3><a href="${post.url}">${post.title}</a></h3>
//         <p>👍 ${post.score} | 💬 ${post.num_comments} | by ${post.author}</p>
//       </div>
//     `;
