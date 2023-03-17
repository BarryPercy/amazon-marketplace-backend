import mongoose from "mongoose";
import { model } from "mongoose";

const { Schema } = mongoose


const reviewSchema = new Schema(
    {
        comment: {type: String, required: true},
        rate: {type: Number, required: true, min: 1, max: 5}
    }
)

const productSchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        brand: {type: String, required:true},
        imageUrl:{type: String, required: true},
        price:{type: Number, required: true},
        category:[{type: String}],
        reviews:[{ type: Schema.Types.ObjectId, ref: "Review"}]
    },
    {
        timestamps: true,
    }
)

productSchema.static("findProductsWithReviews", async function(query) {
   const products = await this.find(query.criteria, query.options.fields)
        .limit(query.options.limit)
        .skip(query.options.skip)
        .sort(query.options.sort)
        .populate({ path: "reviews", select: "comment rate"})
      const total = await this.countDocuments(query.criteria)
      const limit = query.options.limit? query.options.limit:total
      return {products, total, limit}
})

export const ProductModel = model("Product", productSchema)
export const ReviewModel = model("Review", reviewSchema)