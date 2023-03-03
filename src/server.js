import Express from "express" 
import listEndpoints from "express-list-endpoints"
// import authorsRouter from "./api/authors/index.js"
import cors from 'cors'
import productsRouter from "./api/product/index.js"
import filesRouter from "./api/files/index.js"
import reviewsRouter from "./api/reviews/index.js"
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorsHandlers.js"
import { join } from "path"

const server = Express()
const port = 3001
const publicFolderPath = join(process.cwd(), "./public")

server.use(Express.static(publicFolderPath))
server.use(cors())
server.use(Express.json())
server.use("/products", productsRouter)
server.use("/", reviewsRouter)
server.use("/", filesRouter)


server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notfoundHandler) // 404
server.use(genericErrorHandler) // 500

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}`)
})
