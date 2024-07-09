import mongoose from "mongoose";
import blogPostModel from "../models/blogPost.js";
import {unlink,access} from "fs";

//get all BlogPost
export const getAllBlogPost = async (req, res) => {
  try {
    const blogPost = await blogPostModel.find().sort({ createdAt: -1 });
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//create BlogPost
export const createBlogPost = async (req, res) => {
  const { title, body } = req.body;
  if(!req.file){
    return res.status(400).json({ error: "media is required" });
  }
  const media = req.protocol+"://"+req.get("host")+"/assets/images/"+req.file.filename
  // validation
  if (!title) return res.status(400).json({ error: "title is required" });
  if (!body) return res.status(400).json({ error: "body is required" });

  try {
    const createBlogPost = await blogPostModel.create({ title, body, media, author: req.user.id });
    res.status(200).json({ message: "Blog Post Created", createBlogPost });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//single BlogPost
export const singleBlogPost = async (req, res) => {
  try {
    const singleBlogPost = await blogPostModel.findById(req.params.id);
    if (!singleBlogPost) {
      return res.status(404).json({ message: "Blog Post not found" });
    }
    res.status(200).json(singleBlogPost);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//edit BlogPost
export const editBlogPost = async (req, res) => {
  const { title, body } = req.body;
  let media = null;

  // check valid id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  try {
    let getBlog = await blogPostModel.findById(req.params.id).populate("author");
    if (!getBlog) {
      return res.status(404).json({ message: "Blog Post not found" });
    }
    if (req.user.id != getBlog.author._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if(req.file){
      const imageName = getBlog.media.split("/").pop();
      access(`${req.file.destination}/${imageName}`, (err) => {
        if (err) throw new Error("File not found!");
        unlink(`${req.file.destination}/${imageName}`, (err) => {
          if (err) throw new Error("Failed to delete file!");
        });
      })
      media = req.protocol+"://"+req.get("host")+"/assets/images/"+req.file.filename;
    }
    await blogPostModel.updateOne(
      { _id: req.params.id },
      {
        title: title || getBlog.title,
        body: body || getBlog.body,
        media: media || getBlog.media,
      }
    );

    getBlog = await blogPostModel.findById(req.params.id);

    res
      .status(200)
      .json({ message: "Blog Post has been updated", blog: getBlog });
  } catch (error) {
    if (req.file) {
      unlink(`${req.file.path}`, (err) => {
        if (err) throw new Error("Failed to delete file!");
      })
    }
    res.status(500).send("Internal Server Error");
  }
};

//delete BlogPost
export const deleteBlogPost = async (req, res) => {
  try {
    const getBlog = await blogPostModel.findById(req.params.id);
    if (!getBlog) {
      return res.status(404).json({ message: "Blog Post not found" });
    }
    if (req.user.id != getBlog.author._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await blogPostModel.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ message: "Blog Post has been deleted", blog: getBlog });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
