const express = require('express');
const { check , validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserModel = require('../../models/User');


router.post('/',
[
    check('firstName' , 'First Name is requierd').not().isEmpty(),
    check('lastName' , 'Last Name is requierd').not().isEmpty(),
    check('email','Please enter a valid Email').isEmail(),
    check('password','Please enter a password with 6 charactters').isLength({min: 6})

]
, async (req,res)=>{
    //errors
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {return res.status(400).json({ errors: errors.array()})}


    const {firstName, lastName, email, password} = req.body;

    try {
        let user = await UserModel.findOne({ email });
        if (user) {return res.status(400).json({errors : [{msg : 'User alredy exitst'}]})}

        //profile picture
        const avatar = gravatar.url(email,{
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        //create user
        user = new User({
            firstName,
            lastName,
            email,
            avatar,
            password
        });

        //crypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
      

        const payload = {
            user:{id :user.id}
        }

        jwt.sign(payload,
           config.get('jwtSecret'),
           {expiresIn :360000},
           (err,token)=>{
            if(err) throw err;
            res.json({token})
           }
            )
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }

})


module.exports = router;