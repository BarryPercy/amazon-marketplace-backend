import Express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { getProducts, writeProducts } from "../../lib/fs-tools.js"
import { checkProductsSchema, triggerBadRequest } from "./validation.js"

const productsRouter = Express.Router()


productsRouter.post("/", checkProductsSchema, triggerBadRequest, async (req, res, next) => {
    const newProduct = { ...req.body, _id: uniqid(), createdAt: new Date(), updatedAt: new Date() }
    const productsArray = await getProducts();
    productsArray.push(newProduct)
    await writeProducts(productsArray)
    res.status(201).send({ id: newProduct._id })
})

productsRouter.get("/", async (req, res, next) => {
  try{
    const productsArray = await getProducts();
    if (req.query && req.query.category) {
      const filteredProducts = productsArray.filter(product => product.category === req.query.category)
      res.send(filteredProducts)
    }else{
      res.send(productsArray)
    }
  }catch(error){
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try{
    const productsArray = await getProducts();
    const product = productsArray.find(product => product._id === req.params.productId)
    if(product){
      res.send(product)
    }else{
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  }catch(error){
    next(error)
  }
})

  

productsRouter.put("/:productId", async (req, res, next) => {
  try{
    const productsArray = await getProducts();
    const index = productsArray.findIndex(product => product._id === req.params.productId)
    if(index!==-1){
      const oldProduct = productsArray[index]
      const updatedProduct = { ...oldProduct, ...req.body, updatedAt: new Date()}
      productsArray[index] = updatedProduct
      await writeProducts(productsArray)
      res.send(updatedProduct)
    }else{
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  }catch(error){
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try{
    const productsArray = await getProducts();
    const remainingProducts = productsArray.filter(product => product._id !== req.params.productId)
    if(productsArray.length!==remainingProducts.length){
      await writeProducts(remainingProducts)
      res.status(204).send()
    }else{
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  }catch(error){
    next(error)
  }
  
})
export default productsRouter
