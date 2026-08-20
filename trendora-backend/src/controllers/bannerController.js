const Banner = require("../models/Banner");
const cloudinary = require("../config/cloudinary");

// GET ALL BANNERS
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find()
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("GET BANNERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ACTIVE BANNERS
const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({
      active: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("GET ACTIVE BANNERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CREATE BANNER
const createBanner = async (req, res) => {
  try {
    const {
      title = "",
      subtitle = "",
      active = true,
      order = 0,
    } = req.body;

    // Check image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "trendora/banners",
      }
    );

    // Create banner in MongoDB
    const banner = await Banner.create({
      title,
      subtitle,
      image: result.secure_url,
      cloudinaryPublicId: result.public_id,
      active: active === "false" ? false : true,
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });

  } catch (error) {
    console.error("CREATE BANNER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE BANNER
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const {
      title,
      subtitle,
      active,
      order,
    } = req.body;

    // Update text fields
    if (title !== undefined) {
      banner.title = title;
    }

    if (subtitle !== undefined) {
      banner.subtitle = subtitle;
    }

    if (active !== undefined) {
      banner.active =
        active === true ||
        active === "true";
    }

    if (order !== undefined) {
      banner.order = Number(order) || 0;
    }


    // If new image uploaded
    if (req.file) {

      // Delete old image from Cloudinary
      if (banner.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(
            banner.cloudinaryPublicId
          );
        } catch (cloudinaryError) {
          console.error(
            "OLD BANNER DELETE ERROR:",
            cloudinaryError
          );
        }
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "trendora/banners",
        }
      );

      banner.image = result.secure_url;
      banner.cloudinaryPublicId = result.public_id;
    }

    await banner.save();

    res.json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });

  } catch (error) {
    console.error("UPDATE BANNER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE BANNER
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // Delete image from Cloudinary
    if (banner.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(
          banner.cloudinaryPublicId
        );
      } catch (cloudinaryError) {
        console.error(
          "CLOUDINARY DELETE ERROR:",
          cloudinaryError
        );
      }
    }

    // Delete MongoDB document
    await Banner.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });

  } catch (error) {
    console.error("DELETE BANNER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getBanners,
  getActiveBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};