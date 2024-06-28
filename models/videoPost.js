import mongoose from 'mongoose';

const videoPostSchema = new mongoose.Schema(
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

const videoPostModel = mongoose.model("videoPost", videoPostSchema);
export default videoPostModel