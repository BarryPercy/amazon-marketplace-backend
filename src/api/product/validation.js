import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const productsSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a string!",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description is a mandatory field and needs to be a string!",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Brand is a mandatory field and needs to be a string!",
    },
  },
  price: {
    in: ["body"],
    isString: {
      errorMessage: "Price is a mandatory field and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
  imageUrl: {
    in: ["body"],
    isString: {
      errorMessage: "ImageURL is a mandatory field and needs to be a string!",
    },
  }
}

export const checkProductsSchema = checkSchema(productsSchema)

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req)
  console.log(errors.array())
  if (errors.isEmpty()) {
    next()
  } else {
    next(createHttpError(400, "Errors during blog post validation", { errorsList: errors.array() }))
  }
}
