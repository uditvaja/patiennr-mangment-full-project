
/* ------------------------------- DEFINE AREA ------------------------------ */
const express = require("express");
const router = express.Router();

// const { singleFileUpload } = require("../../../../helpers/upload");
const {   billCreateController } = require("../../../controllers");
const { singleFileUpload } = require("../../../helpers/upload");



/* -------------------------- CREATE/SIGNUP DOCTOR ----------- */
router.post("/create-bill", billCreateController.createBill);

router.get("/list-bill", billCreateController.monitorBill);
router.get("/list-bill-search-patient", billCreateController.searchPatient);
// router.put("/hospital-bill-update",  singleFileUpload('/hospitalImg', 'hospital_logo'), billCreateController.updateHospitalAndBill);




module.exports = router;