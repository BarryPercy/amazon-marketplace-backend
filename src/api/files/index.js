// import Express from "express"
// import multer from "multer"
// import { extname } from "path"
// import { saveProductsImageUrls } from "../../lib/fs-tools.js"
// import { getProducts, writeProducts } from "../../lib/fs-tools.js"
// import createHttpError from "http-errors"
// import { triggerBadRequest } from "../product/validation.js"

// const filesRouter = Express.Router()

// filesRouter.post("/products/:productId/single", triggerBadRequest, multer().single("imageUrl"), async (req, res, next) => {
//     try {
//       // file upload
//       // console.log("FILE:", req.file)
//       // console.log("BODY:", req.body)
//       const originalFileExtension = extname(req.file.originalname)
//       const fileName = req.params.productId + originalFileExtension
//       await saveProductsImageUrls(fileName, req.file.buffer)
      
//       //updating product image
//       const productsArray = await getProducts();
//       const index = productsArray.findIndex(product => product._id === req.params.productId)
//       if(index!==-1){
//         const oldProduct = productsArray[index]
//         const updatedProduct = { ...oldProduct, "imageUrl": `http://localhost:3001/img/product/${fileName}`, updatedAt: new Date()}
//         productsArray[index] = updatedProduct
//         await writeProducts(productsArray)
//         res.send(updatedProduct)
//       }else{
//         next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
//       }
//     } catch (error) {
//       next(error)
//     }
//   })

// export default filesRouter


