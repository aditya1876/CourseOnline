const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//Users Schema
const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
});

const AdminSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
});

const CourseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageURL: String,
  creatorId: ObjectId,
});

const PurchasesSchema = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
});

//link schema to the db collections(tables)
const UserCollection = mongoose.model("users_collection", UserSchema);
const AdminCollection = mongoose.model("admin_collection", AdminSchema);
const CourseCollection = mongoose.model("course_collection", CourseSchema);
const PurchasesColleciton = mongoose.model(
  "purchases_collection",
  PurchasesSchema,
);

module.exports = {
  UserCollection,
  AdminCollection,
  CourseCollection,
  PurchasesColleciton,
};
