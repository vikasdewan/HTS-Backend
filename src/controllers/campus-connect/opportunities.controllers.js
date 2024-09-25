import CarrerModel from "../../models/campus-connect-models/opportunities.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import UserModel from "../../models/campus-connect-models/user.model.js";

// Adding a New Career Opportunity (Only for 3rd and 4th Year Students)
const addOpportunity = asyncHandler(async (req, res) => {
  const { title, description, category, location, company, dueDate, applyLink } = req.body;

  // Ensure all required fields are provided
  if (!(title && description && category && location && company && dueDate)) {
    throw new ApiError(404, "All fields are mandatory");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(404, "User Id not found");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Restricting users who are not in 3rd or 4th year
  if (user.year !== 3 && user.year !== 4) {
    throw new ApiError(403, "Only 3rd and 4th year students can add career opportunities");
  }

  // Create a new career opportunity
  const opportunity = await CarrerModel.create({
    title,
    description,
    category,
    location,
    company,
    dueDate,
    postedBy: userId,
    applyLink: applyLink || "",
    college: user.college,
  });

  if (!opportunity) {
    throw new ApiError(400, "Error while creating career opportunity");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { opportunity }, "Career opportunity added successfully"));
});

// Updating an Existing Career Opportunity
const updateOpportunity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(404, "Opportunity ID not provided in parameters");
  }

  const opportunity = await CarrerModel.findById(id);
  if (!opportunity) {
    throw new ApiError(404, "No such opportunity found or wrong ID");
  }

  const updatedOpportunity = await CarrerModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { updatedOpportunity }, "Career opportunity updated successfully"));
});

// Deleting a Career Opportunity
const deleteOpportunity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(404, "Opportunity ID not provided in parameters");
  }

  const opportunity = await CarrerModel.findById(id);
  if (!opportunity) {
    throw new ApiError(404, "No such opportunity found or wrong ID");
  }

  const deletedOpportunity = await CarrerModel.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, { deletedOpportunity }, "Career opportunity deleted successfully"));
});

// Get Details of a Single Career Opportunity
const getOpportunityDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(404, "Opportunity ID not provided in parameters");
  }

  const opportunity = await CarrerModel.findById(id).populate("postedBy", "name email");
  if (!opportunity) {
    throw new ApiError(404, "No such opportunity found or wrong ID");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { opportunity }, "Career opportunity fetched successfully"));
});

// Get All Career Opportunities
const getAllOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await CarrerModel.find();
  if (!opportunities) {
    throw new ApiError(404, "No opportunities available");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { opportunities }, "All career opportunities fetched successfully"));
});

// Get Career Opportunities of a College
const getAllOpportunitiesOfCollege = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(404, "User not found");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const opportunities = await CarrerModel.find({ college: user.college });
  if (!opportunities || opportunities.length === 0) {
    throw new ApiError(404, "No opportunities available for your college");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { opportunities }, "All career opportunities for your college fetched successfully"));
});

export {
  addOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunityDetails,
  getAllOpportunities,
  getAllOpportunitiesOfCollege,
};
