import imagePostModel from './../models/imagePost.js';
import { unlink, access } from 'fs';
import mongoose from 'mongoose';

//get all ImagePost
export const getAllImagePost = async (req, res) => {
  try {
    const imagePost = await imagePostModel.find().sort({ createdAt: -1 });
    res.status(200).json(imagePost);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//create ImagePost
export const createImagePost = async (req, res) => {
  const { title, body } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: "media is required" });
  }
  const media = req.protocol + "://" + req.get("host") + "/assets/images/" + req.file.filename
  // validation
  if (!title) return res.status(400).json({ error: "title is required" });
  if (!body) return res.status(400).json({ error: "body is required" });

  try {
    const createImagePost = await imagePostModel.create({ title, body, media,author: req.user.id });
    res.status(200).json({ message: "Image Post has been created", createImagePost });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//single ImagePost
export const singleImagePost = async (req, res) => {
  try {
    const singleImagePost = await imagePostModel.findById(req.params.id);
    if (!singleImagePost) {
      return res.status(404).json({ message: "Image Post not found" });
    }
    res.status(200).json(singleImagePost);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//edit ImagePost
export const editImagePost = async (req, res) => {
  const { title, body } = req.body;
  let media = null;

  // check valid id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    if (req.file) {
      unlink(`${req.file.path}`, (err) => {
        if (err) throw new Error("Failed to delete file!");
      })
    }
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    let getImage = await imagePostModel.findById(req.params.id);
    if (!getImage) {
      return res.status(404).json({ message: "Image Post not found" });
    }
    if (req.user.id != getImage.author._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.file) {
      const imageName = getImage.media.split("/").pop();
      console.log(`${req.file.destination}/${imageName}`)
      access(`${req.file.destination}/${imageName}`, (err) => {
        if (err) throw new Error("File not found!");
        unlink(`${req.file.destination}/${imageName}`, (err) => {
          if (err) throw new Error("Failed to delete file!");
        });
      })
      media = req.protocol + "://" + req.get("host") + "/assets/images/" + req.file.filename;
    }
    await imagePostModel.updateOne(
      { _id: req.params.id },
      {
        title: title || getImage.title,
        body: body || getImage.body,
        media: media || getImage.media
      }
    );

    getImage = await imagePostModel.findById(req.params.id);
    res.status(200).json({ message: "Image Post has been updated", Image: getImage });
  } catch (error) {
    if (req.file) {
      unlink(`${req.file.path}`, (err) => {
        if (err) throw new Error("Failed to delete file!");
      })
    }
    res.status(500).send("Internal Server Error");
  }
};

//delete ImagePost
export const deleteImagePost = async (req, res) => {
  try {
    const getImage = await imagePostModel.findById(req.params.id);
    if (!getImage) {
      return res.status(404).json({ message: "Image Post not found" });
    }
    if (req.user.id != getImage.author._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await imagePostModel.deleteOne(
      { _id: req.params.id, }
    );
    res.status(200).json({ message: "Image Post has been deleted", image: getImage });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

