import express from "express";
import { categoryController,
    createCategoryController,
    deleteCategoryController,
    singleCategoryController,
    updateCategoryController,
 } from "../controller/categoryController.js";

 const router = express.Router();

 //routes
// create category
router.post(
    "/create-category",
    createCategoryController
  );
  
  //update category
  router.put(
    "/update-category/:name",
    updateCategoryController
  );
  
  //getALl category
  router.get("/get-category", categoryController);
  
  //single category
  router.get("/single-category/:slug", singleCategoryController);
  
  //delete category
  router.delete(
    "/delete-category/:name",
    deleteCategoryController
  );
  
  export default router;