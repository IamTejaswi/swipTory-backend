const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    slide: [
      {
        heading: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
      },
    ],
    refUserId: {
      typr: mongoose.ObjectId,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        username: String,
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        username: String,
      },
    ],

    totalLikes: {
      type: Number,
      default: 0,
    },

    addedBy: {
      type: String,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Story", storySchema);
