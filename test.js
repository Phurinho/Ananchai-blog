const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')

mongoose.connect('mongodb+srv://admin:1234@cluster0.d3vxv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
    useNewUrlParser: true
})


//Insert data
// BlogPost.create({
//     title:"This is first post",
//     body:"This is first post content"
// }).then(()=>{
//     console.log('Insert data successfully');
// }).catch(err=>{
//     console.log(err);  
// })

//Read data 
BlogPost.find({}).then((data)=>{
    console.log(data);
}).catch(err=>{
    console.log(err);  
})