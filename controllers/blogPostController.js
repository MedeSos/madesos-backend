const blogPostModel = require("../models/blogPost");

//get all BlogPost
const getAllBlogPost = async (req, res) => {
  try {
    const blogPost = await blogPostModel.find().sort({ createdAt: -1 });
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//create BlogPost
const createBlogPost = async (req, res) => {
  const { title, body, media } = req.body;
  try {
    const createBlogPost = await blogPostModel.create({ title, body, media });
    res.status(200).json({ message: "Blog Post Created", createBlogPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//single BlogPost
const singleBlogPost = async (req, res) => {
  try {
    const singleBlogPost = await blogPostModel.findById(req.params.id);
    res.status(200).json(singleBlogPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//edit BlogPost
const editBlogPost = async (req, res) => {
  const { title, body, media } = req.body;
  try {
    const user = await blogPostModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        body,
        media,
      }
    );
    res.status(200).json({ message: "Blog Post Upated", editBlogPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete BlogPost
const deleteBlogPost = async (req, res) => {
  try {
    const deleteBlogPost = await blogPostModel.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(200).json({ message: "Blog Post Deleted", deleteBlogPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllBlogPost,
  singleBlogPost,
  editBlogPost,
  createBlogPost,
  deleteBlogPost,
};
