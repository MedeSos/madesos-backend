import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    media: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const blogPostModel = mongoose.model("blogPost", blogPostSchema);
export default blogPostModel;