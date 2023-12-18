const Product = require("../../../model/productModel");
const fs = require("fs")

//create product
exports.createProduct = async (req, res) => {
    const file = req.file;
    let filePath;
    if (!file) {
      filePath =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dQPM88-Vq0f-YM8xILMQdKktXgKBMN6XH9cCBleA&s";
    } else {
      filePath = req.file.filename;
    }
    const {
      productName,
      productDescription,
      productPrice,
      productStatus,
      productStockQty,
    } = req.body;
    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productStatus ||
      !productStockQty
    ) {
      return res.status(400).json({
        message:
          "Please provide productName,productDescription,productPrice,productStatus,productStockQty",
      });
    }

    //insert into Product collection/table
    await Product.create({
      productName,
      productDescription,
      productPrice,
      productStatus,
      productStockQty,
      productImage: process.env.BACKEND_URL + filePath,
    });
    res.status(200).json({
      message: "Product Created Successfully",
    });
};

//products
exports.getProducts =  async(req,res)=>{
  const products = await Product.find()
  if(products.length == 0){
    res.status(400).json({
      message : "No products found",
      products : []
    })
  }else{
    res.status(200).json({
      message : "Products fetched successfully",
      products
    })
  }
}

//single product
exports.getProduct = async(req,res)=>{
  const {id} = req.params
  if(!id){
    return res.status(400).json({
      message: "Please provide id(productId)"
    })
  }
  const product = await Product.find({_id : id})
  if(product.length == 0){
    res.status(400).json({
      message : "No product found with that id",
      product : []
    })
  }else{
    res.status(200).json({
      message : "Product fetched successfully",
      product
    })
  }
}


//delete product
exports.deleteProduct = async(req , res)=> {
    const {id} = req.params
    if(!id){
      return res.status(400).json({
        message : "Please provide id"
      })
    }
    const oldData = await Product.findById(id)
    if(!oldData){
        return res.status(404).json({
            message : "No data found with that id"
        })
    }

    const oldProductImage = oldData.productImage  //http://localhost:3000/1702898324252-photo.jpg
    const lengthToCut = process.env.BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut)
      fs.unlink("./uploads/" + finalFilePathAfterCut,(err)=>{
        if(err){
          console.log("error deleting file",err)
        }else{
          console.log("file deleted successfully")
        }
      })

    await Product.findByIdAndDelete(id)
    res.status(200).json({
      message : "Product deleted successfully"
    })
}


//edit product
exports.editProduct = async(req,res)=>{
  const {id} = req.params
  const {productName,productDescription,productPrice,productStatus,productStockQty} = req.body
  if (!productName || !productDescription ||!productPrice ||!productStatus ||!productStockQty ||!id) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,productPrice,productStatus,productStockQty,id",
    });
  }
  const oldData = await Product.findById(id)
  if(!oldData){
    return res.status(404).json({
      message : "No data found with that id"
    })
  }
    const oldProductImage = oldData.productImage  //http://localhost:3000/1702898324252-photo.jpg
    const lengthToCut = process.env.BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut)

    if(req.file && req.file.filename){
      //remove file from the uploads folder
      fs.unlink("./uploads/" + finalFilePathAfterCut,(err)=>{
        if(err){
          console.log("error deleting file",err)
        }else{
          console.log("file deleted successfully")
        }
      })
    }
    const datas = await Product.findByIdAndUpdate(id,{
      productName,
      productDescription,
      productPrice,
      productStatus,
      productStockQty,
      productImage: req.file && req.file.filename ? process.env.BACKEND_URL + req.file.filename : oldProductImage
    },{
      new : true,
  })
    res.status(200).json({
      message : "Product updated successfully",
      datas
    })
}