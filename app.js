const Kao = require("koa");
const Router = require("koa-router");
const path = require("path");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const views = require("koa-views");
const mongoose = require("mongoose");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const {
  greatTable,
  greatStatistic,
  addNewProduct,
  deleteProduct,
  editProduct,
  updateProduct,
} = require("./api/product.controllers");

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
    cluster.on("exit", (worker, code, signal) => {
      if (signal) {
        console.log(`worker was killed by signal: ${signal}`);
      } else if (code !== 0) {
        console.log(`worker exited with error code: ${code}`);
      } else {
        console.log("worker success!");
      }
    });
  }
} else {
  const app = new Kao();
  const router = new Router();
  app.use(bodyParser());

  app.use(logger());
  app.use(
    views(path.resolve(__dirname, "template"), {
      extension: "pug",
    })
  );

  router.get("/", greatTable);
  router.get("/statistic", greatStatistic);
  router.post("/add", addNewProduct);
  router.post("/delete/:id", deleteProduct);
  router.post("/edit/:params", editProduct);
  router.post("/update/:id", updateProduct);

  app.use(router.routes());

  mongoose.Promise = Promise;
  mongoose.set("debug", true);
  mongoose
    .connect(
      "mongodb+srv://nodeAdmin:Mhm9HD9OozVLrkG6@cluster0.2q0jf.mongodb.net/products?authSource=admin&replicaSet=atlas-11c4fw-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
      { useUnifiedTopology: true, useNewUrlParser: true }
    )
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });

  app.listen(3000, () =>
    console.log(`Server running on http://localhost:3000`)
  );
}
