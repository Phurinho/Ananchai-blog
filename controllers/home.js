const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
  // Fetch blog posts sorted by 'datePosted' in descending order
  const blogposts = await BlogPost.find({})
    .populate('userid')
    .sort({ datePosted: -1 }); // Add this line to sort by datePosted in descending order

  res.render('index', {
    blogposts,
  });
};
