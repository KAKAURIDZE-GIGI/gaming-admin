const express = require("express");
const crudController = require("../controllers/crudController");


function resourceRouter(Model, opts, guards = []) {
  const router = express.Router();
  const c = crudController(Model, opts);

  router.get("/", guards, c.list);
  router.get("/:id", guards, c.get);
  router.post("/", guards, c.create);
  router.put("/:id", guards, c.update);
  router.delete("/:id", guards, c.remove);

  return router;
}

module.exports = resourceRouter;