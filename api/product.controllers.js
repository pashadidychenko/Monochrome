const Joi = require("joi");
const productModel = require("./product.model");
const getStatistic = require("./product.helpers");

async function greatTable(ctx) {
  try {
    const productData = await productModel.find();
    await ctx.render("index", {
      list: productData,
    });
  } catch (err) {
    ctx.status = 400;
    ctx.body = err;
  }
}

async function greatStatistic(ctx) {
  try {
    const productData = await productModel.find();
    const statisticData = getStatistic(productData);
    await ctx.render("statistic", { statistic: statisticData });
  } catch (err) {
    ctx.status = 400;
    ctx.body = err;
  }
}

async function addNewProduct(ctx, next) {
  try {
    ctx.status = 200;
    await productModel.create(ctx.request.body);
  } catch (err) {
    console.log("5");
    ctx.status = 400;
    ctx.body = err;
  }
}

function validateProduct(ctx, next) {
  const createProducttRules = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
    summary: Joi.number().required(),
  });
  const result = createProducttRules.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error.details;
    return;
  }
  next();
}

async function getProductById(ctx, next) {
  try {
    let _id = ctx.params.id;
    if (!_id) {
      ctx.status = 400;
      ctx.body = { message: "bad request params" };
      return;
    }
    let product = await productModel.findById(_id);
    if (!product) {
      ctx.status = 404;
      ctx.body = { message: "can not find product" };
      return;
    }
    console.log(product);
    await ctx.render("edit", {
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      summary: product.summary,
    });
  } catch (err) {
    ctx.status = 400;
    ctx.body = err;
  }
}

async function updateProduct(ctx, next) {
  try {
    const product = await productModel.findByIdAndUpdate(ctx.params.id, {
      $set: ctx.request.body,
    });
    if (!product) {
      ctx.status = 404;
      ctx.body = { message: "product not found" };
      return;
    }
    ctx.status = 200;
    ctx.body = { message: "product update" };
    return;
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(ctx, next) {
  try {
    let _id = ctx.params.id;
    if (!_id) {
      ctx.status = 400;
      ctx.body = { message: "bad request params" };
      return;
    }
    let result = await productModel.findByIdAndDelete({ _id });
    result
      ? await ctx.render("message", { message: "product delete" })
      : await ctx.render("message", { message: "product not found" });
  } catch (err) {
    ctx.status = 400;
    ctx.body = err;
  }
}

function checkDataExist(ctx, next) {
  if (Object.keys(ctx.request.body).length === 0) {
    ctx.status = 400;
    ctx.body = { message: "missing fields" };
    return;
  }
  next();
}

module.exports = {
  greatTable,
  greatStatistic,
  addNewProduct,
  deleteProduct,
  updateProduct,
  validateProduct,
  checkDataExist,
  getProductById,
};
