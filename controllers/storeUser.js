const User = require('../models/User')

module.exports = (req,res) => {
    User.create(req.body).then(()=>{
        console.log('User registered successfully!');
        res.redirect('/')
    }).catch((error)=>{
        if(error){            
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
            req.flash('validationErrors',validationErrors)
            req.flash('data', req.body)
            // req.session.validationErrors = validationErrors
            return res.redirect('/auth/register')
        }
        
    })
}