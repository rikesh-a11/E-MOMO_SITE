const Review = require("../../../model/reviewModel")
const Product = require("../../../model/productModel")

//create review
exports.createReview = async(req,res)=>{
    const userId = req.user.id
    const {rating,message} = req.body
    const productId = req.params.id
    if(!rating || !message || !productId){
        return res.status(400).json({
            message: "please provide rating,message,productId"
        })
    }

    //check if that productId product exists or not
    const productExist = await Product.findById(productId)
    if(!productExist){
        return res.status(404).json({
            message : "Product with that productId doesn't exist"
        })
    }

    //insert them into review
    await Review.create({
        userId,
        productId,
        rating,
        message
    })

    res.status(200).json({
        message : "Review added successfully"
    })
}

//get my review
exports.getMyReviews = async(req,res)=>{
    const userId = req.user.id
    const reviews = await Review.find({userId})
    if(review.length == 0){
        return res.status(404).json({
            message : "You haven't given review to any products yet",
            reviews : []
        })
    }else{
        res.status(200).json({
            message : "Review fetched successfully",
            data : reviews
        })
    }
}

//delete Review
exports.deleteReview = async(req,res) =>{
    const reviewId = req.params.id

    //check if that user created this review
    if(!reviewId){
        res.status(400).json({
            message : "Please provide reivew Id"
        })
    }
    const userId = req.user.id
    const review = Review.findById(reviewId)
    const ownerOfReview = review.userId
    if(ownerOfReview !== userId){
        return res.status(400).json({
            message : "You dont have permission to delete this review"
        })
    }

    await Review.findByIdAndDelete(reviewId)
    res.status(200).json({
        message : "Review deleted successfully"
    })
}

//for testing
// exports.addProductReview = async(req,res)=>{
//     const productId = req.params.id 
//     const {rating,message} = req.body 
//     const userId = req.user.id 
//     const review = {
//         userId , 
//         rating,
//         message,
//     }
//     const product = await Product.findById(productId)
//     product.reviews.push(review) 
//     await product.save() 
//     res.json({
//         message : "Review done"
//     })
// }