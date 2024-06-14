const videoPostModel = require("../models/videoPost");

//get all ImagePost
const getAllVideoPost = async (req, res) => {
  try {
    const videoPost = await VideoPostModel.find().sort({ createdAt: -1 });
    res.status(200).json(videoPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//create VideoPost
const createVideoPost = async (req, res) => {
  const { title, body, media } = req.body;
  try {
    const createVideoPost = await VideoPostModel.create({ title, body, media });
    res.status(200).json(createVideoPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//single VideoPost
const singleVideoPost = async (req, res) => {
  try {
    const singleVideoPost = await VideoPostModel.findById(req.params.id);
    res.status(200).json(singleVideoPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//edit VideoPost
const editVideoPost = async (req, res) => {
  const { title, body, media } = req.body;
  try {
    const user = await VideoPostModelModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        body,
        media,
      }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete VideoPost
const deleteVideoPost = async (req, res) => {
  try {
    const deleteVideoPost = await blogImageModel.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(200).json(deleteVideoPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllVideoPost,
  singleVideoPost,
  editVideoPost,
  createVideoPost,
  deleteVideoPost,
};
