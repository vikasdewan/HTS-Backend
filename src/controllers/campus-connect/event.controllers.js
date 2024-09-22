// {
//     post event
//     update event
//     delete event
//     get single event
//     get all event
// }
import EventModel from "../../models/campus-connect-models/event.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

//Adding a new Event 
const addEvent = asyncHandler(async (req, res) => {

  const { title, location, description, organizer, date, applyLink } = req.body;
  if (!(title && location && description && organizer && date && applyLink)) {
    throw new ApiError(404, "All Details are Mandatory ");
  }
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(404, "User Id Not Found ");
  }

  const posterLocalPath = req.files?.poster[0]?.path;
  let poster;
  if(posterLocalPath){
    poster = await uploadOnCloudinary(posterLocalPath);
  }

  const event = await EventModel.create({
    title,
    location,
    description,
    organizer,
    date,
    applyLink,
    postedBy: userId,
    poster:poster?.secure_url || ""
  });

  if (!event) {
    throw new ApiError(400, "Error while creating event ");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, { event }, "Event Added Successfully "));
});

//Updating a new Event 
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if(!id){
    throw new ApiError(404,"Event Id Not Present in Parameter");
  }
  const event = await EventModel.findById(id);
  if(!event){
    throw new ApiError(404,"No Such Event Found || Wrong Event Id")
  }
  const updatedEvent = await EventModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  return res
  .status(201)
  .json(new ApiResponse(201,{updatedEvent},"Event Updated Successfully"));
});

export { addEvent,updateEvent };
