const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema
(
  {   // user create the task
    assigner: 
    {
      type: mongoose.Schema.Types.ObjectId, ref: "User",
      required: true,
    },
    group: 
    {
      type: mongoose.Schema.Types.ObjectId, ref: "Group",
      required: true,
    },
    name: 
    {
      type: String,
      required: true,
    },
    description: 
    {
      type: String,
    },
    status: 
    {
      type: String,
      required: true,
      default: "Pending Completion"
    },
    startDate: 
    {
      type: Date,
      required: true,
      default: Date.now()
    },
    endDate: 
    {
      type: Date,
      required: true,
    },
   // it's a counter, incresed with each user do the task
    completeness: 
    {
      type: Number,
      default: 0,
      required: true,
    },
    //  for more facilities 
    attachedFiles: 
    [
      {
        type:String
      }
    ],
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
