const mongoose = require("mongoose");


// whoCompletedTasksSchema = new mongoose.Schema
// (
//   {
//     UserCompleted: 
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     },
        
//     taskCompleted: 
//     {
//       type:mongoose.Schema.Types.ObjectId,
//       ref: "Task"
//     },
        
//     dateCompleted: 
//     {
//       type:Date
//     }
//   }
// );


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
    // For habits
    isHabit: 
    {
      type: Boolean,
      required: true,
      default: false
    },
    repetitions:
    {
      type: Number, required: true, default: -1   // Make sure that any input from the user smaller than 1 is treated as infinity.
    },
    interval:
    {
      type: String, enum: ["daily", "weekly", "monthly", "yearly"], required: true, default: "daily"
    },
    habitCounter:
    {
      type: Number, required: true, default: 0
    },
    habitScore:
    {
      type: Number, required: true, default: 1
    },
    startDate: 
    {
      type: Date,
      required: true,
      default: Date.now()
    },
    // endDate will be disabled for habits and replaced with repetitions
    endDate: 
    {
      type: Date,
      required: true,
      default: Date.now()
    },
    //  for more facilities 
    attachedFiles: 
    [
      {
        type:String
      }
    ],
    userCompleted: 
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
