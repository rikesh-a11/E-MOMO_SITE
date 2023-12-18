const User = require("../../../model/userModel")

exports.getUsers = async(req,res)=>{
    const users = await User.find().select(["+isOtpVerified","-__v"])         //array ma pathauna parxa   
    if(users.length > 1){
        res.status(200).json({
            messsage : "Users fetched successfully",
            data : users
        })
    }else{
        res.status(404).json({
            messsage : "User collection is empty",
            data: []
        })
    }

}