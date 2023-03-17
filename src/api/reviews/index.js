import Express from "express"
import { ProductModel, ReviewModel } from "../product/model.js"
import createHttpError from "http-errors"

const reviewsRouter = Express.Router()


reviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const newReview = new ReviewModel(req.body)
    const { _id } = await newReview.save()
    const product = await ProductModel.findById(req.params.productId)
  if (!product) return next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
  await ProductModel.findOneAndUpdate(
    { _id: req.params.productId },
    { $push: { reviews: _id }},
    { new: true, runValidators: true}
  )
  res.status(201).send(newReview)
  } catch (error) {
    next(error)
  }
})

reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
  try{
    const product = await ProductModel.findById(req.params.productId)
    .populate({ path: "reviews", select: "comment rate"})
    if (!product) return next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    res.send(product.reviews)
  }catch(error){
    next(error)
  }
})

reviewsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try{
    const product = await ProductModel.findById(req.params.productId)
    if (!product) return next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    const review = await ReviewModel.findById(req.params.reviewId)
    if (!review) return next(createHttpError(404, `Review with id ${req.params.reviewId} not found!`))
    res.send(review)
  }catch(error){
    next(error)
  }
})

reviewsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try{
    const product = await ProductModel.findById(req.params.productId)
    if (!product) return next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    const review = await ReviewModel.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      {new: true, runValidators:true}
      )
    if (!review) return next(createHttpError(404, `Review with id ${req.params.reviewId} not found!`))
    res.send(review)
  }catch(error){
    next(error)
  }
})

reviewsRouter.delete("/:productId/reviews/:reviewId", async (req, res, next) => {
  try{
    const product = await ProductModel.findById(req.params.productId)
    if (!product) return next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    const review = await ReviewModel.findByIdAndDelete(req.params.reviewId)
    if (!review) return next(createHttpError(404, `Review with id ${req.params.reviewId} not found!`))
    res.status(204).send()
  }catch(error){
    next(error)
  }
  
})

export default reviewsRouter
