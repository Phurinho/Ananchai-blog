const BlogPost = require('../models/BlogPost')
const path = require('path')

module.exports = async (req,res) => {

    let image = req.files.image;
    image.mv(path.resolve(__dirname , '..', 'public/assets/img', image.name), async () => {
        await BlogPost.findByIdAndUpdate(
            req.body.id,
            {
                $set: {
                    title: req.body.title,
                    body: req.body.body,
                    image:'/img/' + image.name
                }
            }
        ).populate('userid')
        .then(()=>{
            console.log('Data inserted successfully');
            res.redirect('/posts/mypost')
        }).catch(err=>{
            console.log(err);
        })
    })
}