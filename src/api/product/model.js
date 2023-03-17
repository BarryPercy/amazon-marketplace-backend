import mongoose from "mongoose";
import { model } from "mongoose";

const { Schema } = mongoose


const productSchema = new Schema(
    {
    name: {type: String, required: true},
    description: {type: String, required: true},
    brand: {type: String, required:true},
    imageUrl:{type: String, required: true},
    price:{type: Number, required: true},
    category:[{type: String}],
    reviews:[
        {
          comment: String,
          rate: Number
        }
      ]
    },
    {
        timestamps: true,
    }
)

productSchema.static("findProducts", async function(query) {
   const products = await this.find(query.criteria, query.options.fields)
        .limit(query.options.limit)
        .skip(query.options.skip)
        .sort(query.options.sort)
      const total = await this.countDocuments(query.criteria)
      const limit = query.options.limit? query.options.limit:total
      return {products, total, limit}
})

export default model("Product", productSchema)