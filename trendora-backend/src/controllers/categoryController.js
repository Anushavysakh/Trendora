// const Category = require("../models/Category");

// // GET ALL CATEGORIES
// const getCategories = async (req, res) => {
//   try {
//     const filter = {};

//     if (req.query.usertype) {
//       const types = req.query.usertype.split(",");
//       filter.usertype = { $in: types };
//     }

//     const categories = await Category.find().sort({ category: 1 });

//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // CREATE CATEGORY
// const createCategory = async (req, res) => {
//   try {
//     const category = await Category.create(req.body);

//     res.status(201).json(category);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // UPDATE CATEGORY
// const updateCategory = async (req, res) => {
//   try {
//     const category = await Category.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//       }
//     );

//     res.json(category);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // DELETE CATEGORY
// const deleteCategory = async (req, res) => {
//   try {
//     await Category.findByIdAndDelete(req.params.id);

//     res.json({
//       success: true,
//       message: "Category deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   getCategories,
//   createCategory,
//   updateCategory,
//   deleteCategory,
// };

const Category = require("../models/Category");

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const filter = {};

    // Filter by usertype
    if (req.query.usertype) {
      const types = req.query.usertype.split(",");
      filter.usertype = { $in: types };
    }

    // Filter by category
    if (req.query.category) {
      filter.category = {
        $regex: `^${req.query.category.trim()}$`,
        $options: "i",
      };
    }

    const categories = await Category.find(filter).sort({
      category: 1,
    });

    res.json(categories);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE CATEGORY
const getCategoryById = async (req, res) => {
  try {

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {

    const exists = await Category.findOne({
      category: req.body.category,
    });

    if (exists) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create(req.body);

    res.status(201).json(category);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};