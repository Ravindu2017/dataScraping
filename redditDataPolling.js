let afterToken = null;
let postAge = null;
let allPosts = [];

/*
/**
 * Fetches posts from a Reddit subreddit
 * @param {string} subreddit - Subreddit name (without 'r/')
 * @param {string} sortType - 'hot', 'new', 'top', etc.
 * @param {number} limit - Number of posts to fetch (max 100)
 * @returns {Promise<Array>} Array of Reddit posts
 */
async function fetchRedditPosts(subreddit, sortType, limit, nextToken) {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/${sortType}.json?limit=${limit}&after=${nextToken}`;

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
    // console.log(data.data.children);
    // return (
    //   afterToken,
    //   data.data.children.map((post) => ({
    //     id: post.data.id,
    //     title: post.data.title,
    //     author: post.data.author,
    //     score: post.data.score,
    //     url: post.data.url,
    //     created_utc: post.data.created_utc,
    //     num_comments: post.data.num_comments,
    //     pic: post.data.url_overridden_by_dest,
    //     preview: post.data.thumbnail,
    //   }))
    // );
  } catch (error) {
    console.error("Error fetching Reddit data:", error);
    return [];
  }
}

// // Fetch Posts in 1 go
fetchRedditPosts("watches", "top", 30, afterToken).then((res) => {
  // Display in your webpage:
  console.log(res[0][1], res[1]);
  //   let posts = res[0];
  //   posts.forEach((post) => {
  //     console.log(
  //       post,
  //       post.pic,
  //       post.title,
  //       post.author,
  //       post.score,
  //       post.preview
  //     );
  //   });

  console.log("Top Watches posts:", res[0].length);
});

fetchFivePages("watches", "top", 30, afterToken).then((res) => {
  console.log();
});
