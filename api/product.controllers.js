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
    ctx.body = await productModel.create(ctx.request.body);
    ctx.redirect("/");
  } catch (err) {
    ctx.status = 400;
    console.log(err);
    ctx.redirect("/");
  }
}
async function editProduct(ctx, next) {
  await ctx.render("edit", JSON.parse(ctx.params.params));
}

async function updateProduct(ctx, next) {
  const requestProduct = ctx.request.body;
  let _id = ctx.params.id;
  if (!_id) {
    ctx.status = 400;
    ctx.body = "bad request params";
    return;
  }

  let product = await productModel.findById(_id);
  if (!product) {
    ctx.status = 404;
    ctx.body = "can not find such category";
    return;
  }

  if (requestProduct.name) product.name = requestProduct.name;
  if (requestProduct.category) product.category = requestProduct.category;
  if (requestProduct.price) product.price = requestProduct.price;
  if (requestProduct.summary) product.summary = requestProduct.summary;

  let result = await product.save();
  if (result) ctx.body = result;
  else ctx.body = "update category fail";
  ctx.redirect("/");
}

async function deleteProduct(ctx, next) {
  console.log("ctx", ctx);
  let _id = ctx.params.id;
  if (!_id) {
    ctx.status = 400;
    ctx.body = "bad request params";
    return;
  }
  let result = await productModel.findByIdAndDelete({ _id });
  if (result) ctx.body = "product delete";
  else ctx.body = "delete product fail";
  ctx.redirect("/");
}

module.exports = {
  greatTable,
  greatStatistic,
  addNewProduct,
  deleteProduct,
  editProduct,
  updateProduct,
};
