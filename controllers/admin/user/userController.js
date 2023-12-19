const User = require("../../../model/userModel")

exports.getUsers = async(req,res)=>{
    const userId = req.user.id
    const users = await User.find({_id : {$ne : userId}}).select(["+isOtpVerified","-__v"])         //array ma pathauna parxa   
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

//delete User API
exports.deleteUser = async(req,res)=>{
    const userId = req.params.id
    if(!userId){
        return res.status(404).json({
            messsage : "please provide userId"
        })
    }

    //check if that userId exists or not
    const user = await User.findById(userId)
    if(!user){
        res.status(404).json({
            messsage : "User not found with that userId"
        })
    }else{
        await User.findByIdAndDelete(userId)
        res.status(200).json({
            messsage : "User delete successfully"
        })
    }
}

