import videoPostModel from './../models/videoPost.js';

//get all ImagePost
export const getAllVideoPost = async (req, res) => {
  try {
    const videoPost = await videoPostModel.find().sort({ createdAt: -1 });
    res.status(200).json(videoPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//create VideoPost
export const createVideoPost = async (req, res) => {
  const { title, body, media } = req.body;
  try {
    const createVideoPost = await videoPostModel.create({ title, body, media });
    res.status(200).json({ message: "Video Post Updated", createVideoPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//single VideoPost
export const singleVideoPost = async (req, res) => {
  try {
    const singleVideoPost = await videoPostModel.findById(req.params.id);
    res.status(200).json(singleVideoPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//edit VideoPost
export const editVideoPost = async (req, res) => {
  const { title, body, media } = req.body;
  try {
    const editVideoPost = await videoPostModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        body,
        media,
      }
    );
    res.status(200).json({ message: "Video Post Updated", editVideoPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete VideoPost
export const deleteVideoPost = async (req, res) => {
  try {
    const deleteVideoPost = await videoPostModel.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(200).json({ message: "Video Post Deleted", deleteVideoPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

