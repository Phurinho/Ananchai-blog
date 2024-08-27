const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
  // Fetch blog posts sorted by 'datePosted' in descending order
  const blogposts = await BlogPost.find({ userid: req.session.userId })
    .populate('userid')
    .sort({ datePosted: -1 }); // Add this line to sort by datePosted in descending order

  if (req.session.userId) {
    return res.render('mypost', {
      blogposts,
    });
  }

  res.redirect('/auth/login');
};
