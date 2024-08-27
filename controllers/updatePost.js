const BlogPost = require('../models/BlogPost');
const path = require('path');

module.exports = async (req, res) => {
    let image = req.files.image;
    let imagePath = path.resolve(__dirname, '..', 'public/assets/img', image.name);

    console.log('Received data:', {
        id: req.body.id,
        title: req.body.title,
        body: req.body.body,
        imagePath: imagePath
    });

    image.mv(imagePath, async (error) => {
        if (error) {
            // console.log('Error moving the image:', error);
            return res.status(500).send('Error occurred while uploading image.');
        }

        try {
            let result = await BlogPost.findOneAndUpdate(
                 req.body.id ,
                {
                    $set: {
                        title: req.body.title,
                        body: req.body.body,
                        image: '/img/' + image.name
                    }
                },
                { new: true } // Ensure that the updated document is returned
            ).populate('userid');

            if (!result) {
                console.log('No blog post found with the given ID');
                return res.status(404).send('Blog post not found');
            }

            console.log('Data updated successfully:', result);
            res.redirect('/posts/mypost');
        } catch (err) {
            console.log('Error updating the post:', err);
            res.status(500).send('Error occurred while updating the post.');
        }
    });
};
