const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
  // Fetch blog posts sorted by 'datePosted' in descending order
  const blogposts = await BlogPost.find({ userid: req.session.userId })
    .populate('userid')
    .sort({ datePosted: -1 }); // Sorting by datePosted in descending order

  if (req.session.userId) {
    // Corrected render syntax with proper parentheses
    return res.render('myposts', { blogposts });
  }

  res.redirect('/auth/login');
};
