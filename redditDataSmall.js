/**
 * Fetches posts from a Reddit subreddit
 * @param {string} subreddit - Subreddit name (without 'r/')
 * @param {string} sortType - 'hot', 'new', 'top', etc.
 * @param {number} limit - Number of posts to fetch (max 100)
 * @returns {Promise<Array>} Array of Reddit posts
 */

const postLimit = 40;
let afterToken = null;
let postAge = null;
let allPosts = [];

async function fetchRedditPosts(subreddit, sortType, limit) {
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
    afterToken = data.data.after;
    postAge = Date.now();
    allPosts = [...allPosts, ...data.data.children];
    return [allPosts, afterToken];
    // return data.data.children.map((post) => ({
    //   id: post.data.id,
    //   title: post.data.title,
    //   author: post.data.author,
    //   score: post.data.score,
    //   url: post.data.url,
    //   created_utc: post.data.created_utc,
    //   num_comments: post.data.num_comments,
    //   after: data.data.after, // this is sent once in response
    // }));
  } catch (error) {
    console.error("Error fetching Reddit data:", error);
    return [];
  }
}

// // Fetch Posts in 1 go
fetchRedditPosts("watches", "top", postLimit).then((posts) => {
  console.log(posts[0].length, posts[1]);
});
