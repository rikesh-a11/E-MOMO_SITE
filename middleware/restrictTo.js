const restrictTo = (...roles) =>{        // ... in parameter is rest operator 
    return (req,res,next) => {
       const userRole = req.user.role
       console.log(roles)
       console.log(userRole)
       if(!roles.includes(userRole)){
        res.status(403).json({
            message : "you don't have permission for this.forbidden"
        })
       }else{
        next()
       }
    }
}



module.exports = restrictTo