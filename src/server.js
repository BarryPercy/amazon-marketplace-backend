import Express from "express" 
import listEndpoints from "express-list-endpoints"
import cors from 'cors'
import productsRouter from "./api/product/index.js"
import filesRouter from "./api/files/index.js"
import reviewsRouter from "./api/reviews/index.js"
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorsHandlers.js"
import { join } from "path"
import mongoose from "mongoose"
import createHttpError from "http-errors"

const server = Express()
const port = 3001
const publicFolderPath = join(process.cwd(), "./public")
server.use(Express.static(publicFolderPath))

mongoose.connect(process.env.MONGO_URL)
const corsOptions = {
  origin: (origin,corsNext) => {
    if(!origin || whiteList.indexOf(origin)!==-1){
      corsNext(null,true)
    }else{
      corsNext(
        corsNext(createHttpError(400, `Origin ${origin} is not in the whitelist!`))
      )
    }
  }
}

server.use(
  cors(corsOptions)
)
server.use(Express.json())
server.use("/products", productsRouter)
server.use("/products", reviewsRouter)
server.use("/", filesRouter)


server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notfoundHandler) // 404
server.use(genericErrorHandler) // 500

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})
