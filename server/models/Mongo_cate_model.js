import mongoose from "mongoose";

const {model, models, Schema} = mongoose;

const CategorySchema = new Schema({
  name: {type:String,required:true},
  parent: {type:mongoose.Types.ObjectId},
  properties: [{type:Object}]
});

export const Categories = models?.Category || model('Category', CategorySchema);