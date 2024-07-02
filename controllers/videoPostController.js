import videoPostModel from './../models/videoPost.js';

//get all videoPost
export const getAllVideoPost = async (req, res) => {
  try {
    const videoPost = await videoPostModel.find().sort({ createdAt: -1 });
    res.status(200).json(videoPost);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//create VideoPost
export const createVideoPost = async (req, res) => {
  const { title, body, media } = req.body;
  // validation
  if (!title) return res.status(400).json({ error: "title is required" });
  if (!body) return res.status(400).json({ error: "body is required" });

  try {
    const createVideoPost = await videoPostModel.create({ title, body, media, author: req.user.id });
    res.status(200).json({ message: "Video Post has been created", createVideoPost });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//single VideoPost
export const singleVideoPost = async (req, res) => {
  try {
    const singleVideoPost = await videoPostModel.findById(req.params.id);
    if (!singleVideoPost) {
      return res.status(404).json({ message: "Video Post not found" });
    }
    if (req.user.id != getVideo.author._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(singleVideoPost);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//edit VideoPost
export const editVideoPost = async (req, res) => {
  const { title, body, media } = req.body;
  try {
    let getVideo = await videoPostModel.findById(req.params.id);
    if (!getVideo) {
      return res.status(404).json({ message: "Video Post not found" });
    }
    if (req.user.id != getVideo.author._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await videoPostModel.updateOne(
      { _id: req.params.id },
      {
        title: title || getVideo.title,
        body: body || getVideo.body,
        media: media || getVideo.media
      }
    );

    getVideo = await videoPostModel.findById(req.params.id);
    res.status(200).json({ message: "Video Post has been updated", video: getVideo });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//delete VideoPost
export const deleteVideoPost = async (req, res) => {
  try {
    const deleteVideoPost = await videoPostModel.findById(req.params.id);
    if (!deleteVideoPost) {
      return res.status(404).json({ message: "Video Post not found" });
    }
    await videoPostModel.deleteOne(
      { _id: req.params.id }
    );
    res.status(200).json({ message: "Video Post has been deleted", video: deleteVideoPost });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

