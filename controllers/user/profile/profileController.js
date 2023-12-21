const User = require("../../../model/userModel")
const bcrypt = require("bcryptjs")

//get my profile controller
exports.getMyProfile = async(req,res)=>{
    const userId = req.user.id
    const myprofile = await User.findbyId(userId)
    //send response
    res.status(200).json({
        data : myprofile,
        message : "Profile fetched successfully"
    })
}


//update my profile controller
exports.updateMyProfile = async(req,res)=>{
    const { userName,userEmail,userPhoneNumber } = req.body
    const userId = req.user.id
    //update profile
   const updateData =  await User.findByIdAndUpdate(userId,{userName,userEmail,userPhoneNumber},{
        runValidators : true,
        new : true
    })
    res.status(200).json({
        message : "Profile updated successfully",
        data : updateData
    })
}


//delete my profile
exports.deleteMyProfile = async(req,res)=>{
    const userId = req.user.id
    await User.findByIdAndDelete(userId)
    res.status(200).json({
        message : "Profile delete successfully",
        data : null
    })
}

//update my password
exports.updatePassword = async(req,res)=>{
    const userId = req.user.id
    const { oldPassword, newPassword, confirmNewPassword} = req.body
    if(!oldPassword || !newPassword || !confirmNewPassword){
        return res.status(400).json({
            message : "Please provide oldPassword,newPassword,confimNewPassword"
        })
    }
    if(newPassword !== confirmNewPassword){
        return res.status(400).json({
            message : "NewPassword and OldPassword doesn't matched"
        })
    }
    //taking out the hash of the oldPassword
    const userData = await User.findById(userId)
    const hashedOldPassword = userData.userPassword


    //check if oldPassword is correct is not
    const isOldPasswordCorrect = bcrypt.compareSync(oldPassword,hashedOldPassword)
    if(!isOldPasswordCorrect){
        return res.status(400).json({
            message : "OldPassword didn't matched"
        })
    }

    //if matched vayo vaney
    userData.userPassword = bcrypt.hashSync(newPassword,12)
    await userData.save()
    res.status(200).json({
        message : "Password changed successfully"
    })
}