const imagePostModel = require("../models/imagePost");

//get all ImagePost
const getAllImagePost = async (req, res) => {
  try {
    const imagePost = await imagePostModel.find().sort({ createdAt: -1 });
    res.status(200).json(imagePost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//create ImagePost
const createImagePost = async (req, res) => {
  const { title, body, media } = req.body;
  try {
    const createImagePost = await imagePostModel.create({ title, body, media });
    res.status(200).json(createImagePost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//single ImagePost
const singleImagePost = async (req, res) => {
  try {
    const singleImagePost = await imagePostModel.findById(req.params.id);
    res.status(200).json(singleImagePost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//edit ImagePost
const editImagePost = async (req, res) => {
  const { title, body, media } = req.body;
  try {
    const user = await imagePostModelModel.findOneAndUpdate(
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

//delete ImagePost
const deleteImagePost = async (req, res) => {
  try {
    const deleteImagePost = await blogImageModel.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(200).json(deleteImagePost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllImagePost,
  singleImagePost,
  editImagePost,
  createImagePost,
  deleteImagePost,
};
