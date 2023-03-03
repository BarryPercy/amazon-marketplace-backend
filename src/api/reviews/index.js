import Express from "express"
import uniqid from "uniqid"
import { getReviews, getProducts, writeReviews } from "../../lib/fs-tools.js"
import { checkReviewsSchema, triggerBadRequest } from "./validation.js"
import createHttpError from "http-errors"

const reviewsRouter = Express.Router()


reviewsRouter.post("/products/:productId/reviews", checkReviewsSchema, triggerBadRequest, async (req, res, next) => {
  const newReview = { ...req.body, _id: uniqid(), productId: req.params.productId, createdAt: new Date()}
  const reviewsArray = await getReviews();
  reviewsArray.push(newReview)
  await writeReviews(reviewsArray)
  res.status(201).send({ id: newReview._id })
})

reviewsRouter.get("/products/:productId/reviews", async (req, res, next) => {
  try{
    const reviewsArray = await getReviews();
    const filterReviewsArray = reviewsArray.filter(review => review.productId === req.params.productId)
    if(filterReviewsArray){
      res.send(filterReviewsArray)
    }else{
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  }catch(error){
    next(error)
  }
})

reviewsRouter.get("/products/:productId/reviews/:reviewId", async (req, res, next) => {
  try{
    const reviewsArray = await getReviews();
    const filterReviews = reviewsArray.find(review => review._id === req.params.reviewId)
    const productsArray = await getProducts();
    const product = productsArray.find(product => product._id === req.params.productId)
    if(!product){
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }else{
      if(filterReviews){
        res.send(filterReviews)
      }else{
        next(createHttpError(404, `Review with id ${req.params.reviewId} not found!`))
      }
    }
  }catch(error){
    next(error)
  }
})

reviewsRouter.put("/products/:productId/reviews/:reviewId", async (req, res, next) => {
  try{
    const reviewsArray = await getReviews();
    const index = reviewsArray.findIndex(review => review._id === req.params.reviewId)
    const productsArray = await getProducts();
    const product = productsArray.find(product => product._id === req.params.productId)
    if(!product){
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }else{
      if(index!==-1){
        const oldReview = reviewsArray[index]
        const updatedReview = { ...oldReview, ...req.body, updatedAt: new Date()}
        reviewsArray[index] = updatedReview
        await writeReviews(reviewsArray)
        res.send(updatedReview)
      }else{
        next(createHttpError(404, `Review with id ${req.params.reviewId} not found!`))
      }
    }
  }catch(error){
    next(error)
  }
})

reviewsRouter.delete("/products/:productId/reviews/:reviewId", async (req, res, next) => {
  try{
    const reviewsArray = await getReviews();
    const remainingReviews = reviewsArray.filter(review => review._id !== req.params.reviewId)
    const productsArray = await getProducts();
    const product = productsArray.find(product => product._id === req.params.productId)
    if(!product){
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }else{
      if(reviewsArray.length!==remainingReviews.length){
        await writeReviews(remainingReviews)
        res.status(204).send()
      }else{
        next(createHttpError(404, `Review with id ${req.params.reviewId} not found!`))
      }
    }
  }catch(error){
    next(error)
  }
  
})

export default reviewsRouter
