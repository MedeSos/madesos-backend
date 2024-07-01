import mongoose from "mongoose";
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;
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
    author: [
      {
        _id: {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const videoPostModel = model("videoPost", videoPostSchema);
export default videoPostModel;
