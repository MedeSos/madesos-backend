import blogPostModel from "../models/blogPost.js";

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
  const { title, body, media } = req.body;
  // validation
  if (!title) return res.status(400).json({ error: "title is required" });
  if (!body) return res.status(400).json({ error: "body is required" });

  try {
    const createBlogPost = await blogPostModel.create({ title, body, media });
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
  const { title, body, media } = req.body;
  try {
    let getBlog = await blogPostModel.findById(req.params.id);
    if (!getBlog) {
      return res.status(404).json({ message: "Blog Post not found" });
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
    await blogPostModel.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ message: "Blog Post has been deleted", blog: getBlog });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
