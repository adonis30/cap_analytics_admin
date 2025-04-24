import mongoose, { Schema } from "mongoose";

const sdgFocusShema = new Schema(

 {
    name: { type: String, required: true},
    description: { type: String },
 },

 {
    timestamps: true,
 }
   

);

const SdgFocus = mongoose.models.SdgFocus || mongoose.model("SdgFocus", sdgFocusShema);

export default SdgFocus;