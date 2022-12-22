const cloudinary = require("../configs/cloudinary");
const asyncHandler = require("express-async-handler");
const Banner = require("../models/bannerModel");
const mongoose = require("mongoose");

// @desc    Update banners
// @route   POST /api/banners
// @access  Private (admin)
const updateBanners = asyncHandler(async (req, res, next) => {
  const { deletedBanners } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // handle deletedBanners
    if (Array.isArray(deletedBanners)) {
      for (const bannerId of deletedBanners) {
        const banner = await Banner.findById(bannerId);
        if (banner) {
          const res = await cloudinary.uploader.destroy(banner.publicId);
          if (res?.result === "ok") {
            await Banner.deleteOne({ _id: bannerId }, { session });
          }
        }
      }
    } else {
      const banner = await Banner.findById(deletedBanners);
      if (banner) {
        const res = await cloudinary.uploader.destroy(banner.publicId);
        if (res?.result === "ok") {
          await Banner.deleteOne({ _id: banner.id }, { session });
        }
      }
    }

    // handle upload new banners
    const uploadOptions = {
      folder: `LazaFake/banners`,
    };

    for (const file of req.files) {
      const uploadResult = await cloudinary.uploader.upload(
        file.path,
        uploadOptions
      );

      if (uploadResult?.public_id && uploadResult?.secure_url) {
        await new Banner({
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
        }).save({ session });
      } else {
        throw new Error("Failed to upload to cloudinary.");
      }
    }

    await session.commitTransaction();
    res.json(await Banner.find({}));
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
});

// @desc    Get banners
// @route   GET /api/banners
// @access  Private (admin)
const getBanners = asyncHandler(async (req, res, next) => {
  res.json(await Banner.find({}));
});

module.exports = {
  updateBanners,
  getBanners,
};
