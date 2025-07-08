const fs = require("fs");
let afterToken = null;
const jsonData = JSON.parse(fs.readFileSync("./reddit-data-two.json", "utf-8"));
afterToken = jsonData[0];
/*
/**
 * Fetches posts from a Reddit subreddit
 * @param {string} subreddit - Subreddit name (without 'r/')
 * @param {string} sortType - 'hot', 'new', 'top', etc.
 * @param {number} limit - Number of posts to fetch (max 100)
 * @returns {Promise<Array>} Array of Reddit posts
 */
async function fetchRedditPosts(subreddit, sortType, limit) {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/${sortType}.json?limit=${limit}&after=${afterToken}`;

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
    // console.log(data.data.children);
    return data.data.children.map((post) => ({
      id: post.data.id,
      title: post.data.title,
      author: post.data.author,
      score: post.data.score,
      url: post.data.url,
      created_utc: post.data.created_utc,
      num_comments: post.data.num_comments,
      pic: post.data.url_overridden_by_dest,
      preview: post.data.thumbnail,
    }));
  } catch (error) {
    console.error("Error fetching Reddit data:", error);
    return [];
  }
}

// // Fetch Posts in 1 go
fetchRedditPosts("watches", "top", 30).then((posts) => {
  //   const stream = fs.createWriteStream("reddit-data-three.json");
  //   stream.write(`[${afterToken},\n`);
  //   posts.forEach((post, i) => {
  //     stream.write(JSON.stringify(post) + (i < posts.length - 1 ? ",\n" : "\n"));
  //   });
  //   stream.write("]");
  //   stream.end();

  // Display in your webpage:
  posts.forEach((post) => {
    console.log(
      post,
      post.pic,
      post.title,
      post.author,
      post.score,
      post.preview
    );
  });

  console.log("Top Watches posts:", posts.length, posts[0].pic);
});
