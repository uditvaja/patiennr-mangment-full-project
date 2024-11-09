// const mongoose = require("mongoose");

const Hospital = require("../../models/hospital.model");
/* ------------------------------- CREATE Hospital  ------------------------------- */
const createHospital= async (req, res) => {
  try {
    const reqBody = req.body;   
    const hospital = await Hospital.create(reqBody);
    if (!hospital) {
      throw new Error("Failed to create hospital");
    }
    res.status(200).json({
      status:200,
      message: "Successfully created a new hospital",
      success: true,
      data: hospital,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    if (!hospitals || hospitals.length === 0) {
      throw new Error("No hospitals found");
    }
    res.status(200).json({
      status: 200,
      message: "Hospitals retrieved successfully",
      success: true,
      data: hospitals,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const getHospitalById = async (req, res) => {
  try {
    // Retrieve the hospital ID from the request parameters
    const { id } = req.params;

    // Find the hospital by ID in the database
    const hospital = await Hospital.findById(id);

    // Check if the hospital was found
    if (!hospital) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Hospital not found",
      });
    }

    // Respond with the hospital data
    res.status(200).json({
      status: 200,
      success: true,
      message: "Hospital retrieved successfully",
      data: hospital,
    });
  } catch (error) {
    // Handle errors and send a response
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
module.exports = {
    createHospital,
    getHospitals,
    getHospitalById
  };
