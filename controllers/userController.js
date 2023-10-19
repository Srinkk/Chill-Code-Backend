const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')


const createNewUser = asyncHandler(async(req,res)=>{
    const { userId, password, name ,e_mail} = req.body;

    if( !userId || !password || !name) {
        res.json({message : "All fields are required"});
    }
    const dup_id = await User.findOne({e_mail}).lean().exec()
    if(dup_id)
    {
        res.json({message : "This email already exists"});
    }
       
        const hashPwd = await bcrypt.hash(password, 10);
        const newUser = {name, e_mail,userId,password:hashPwd}
        const userAdded = await User.create(newUser)

        if(userAdded)
        {   await userAdded.save();
            res.status(200).json({message : "New User Created"});
        }
        else {
            res.status (400).json ({message : "Cannot create new user"});
        }

   
})

module.exports = {
    createNewUser
}