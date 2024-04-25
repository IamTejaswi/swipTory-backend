const Story = require("../models/story");
const User = require("../models/user");

const createStory = async (req, res) => {
  try {
    const { slide, addedBy } = req.body;
    if (!slide || !addedBy) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }
    const refuserId = req.userId;

    const story = new Story({
      slide,
      addedBy,
      refUserId: refuserId,
    });

    await story.save();
    res.json({ message: "story created succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

const getStoryById = async (req, res, next) => {
  try {
    const storyId = req.params.storyId;
    const userId = req.query.userId;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    let totalLikes = story.likes.length;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        const liked = user.likes.includes(storyId);
        const bookmarked = user.bookmarks.includes(storyId);
        return res.status(200).json({
          success: true,
          story,
          liked: liked,
          bookmarked: bookmarked,
          totalLikes,
        });
      } else {
        return res.status(200).json({ success: true, story, totalLikes });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

const editStory = async (req, res, next) => {
  try {
    const { slide, addedBy } = req.body;
    if (!slide || !addedBy) {
      res.status(400).json("please provide all the required feilds");
    }
    const story = await Story.findById(req.params.id);

    if (!story) {
      res.status(404).json({ error: "Story not found" });
    }
    // edit story
    story.slide = slide;
    story.addedBy = addedBy;
    await story.save();
    res.status(200).json({ success: true, story });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};
const getStories = async (req, res, n) => {
  const categories = [
    "food",
    "health and fitness",
    "travel",
    "movie",
    "education",
  ];
  const { userId, category, catLimit, cat } = req.query;

  let page = parseInt(req.query.page) || 1;
  let limit = 4 * page;
  let skip = 0;

  try {
    let stories = [];

    // ----------------------- GET MY STORIES -----------------------
    if (userId) {
      stories = await Story.find({ addedBy: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    // ----------------------- GET ALL STORIES -----------------------
    else if (category && category.toLowerCase() === "all") {
      // GROUP STORIES BY CATEGORY
      const groupedStories = {};

      for (const c of categories) {
        const categoryStories = await Story.find({
          slides: { $elemMatch: { category: c } },
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(cat === c ? catLimit : 4);

        groupedStories[c] = categoryStories;
      }

      return res
        .status(200)
        .json({ success: true, stories: groupedStories, page });
    }
    // ----------------------- GET STORIES BY CATEGORY -----------------------
    else {
      stories = await Story.find({
        slides: { $elemMatch: { category: category } },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return res.status(200).json({ success: true, stories, page });
    }

    res.status(200).json({ success: true, stories, page });
  } catch (error) {
    next(new Error("Error getting stories"));
  }
};
module.exports = { createStory, getStoryById, editStory , getStories};
