import React, { useEffect, useRef, useState } from "react";
import axios from "axios"; // Import Axios
import { Dropdown } from "react-bootstrap";
import DeleteDoctorModal from "../../../components/modals/DeleteDoctorModal";
import DoctorDetailsDrawer from "../../../components/Drawer/DoctorDetailsDrawer";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar";
import "./DoctorManagement.scss";

const DoctorManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [doctors, setDoctors] = useState([]); // State to hold doctors data
  const sidebarRef = useRef(null);
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
 console.log("Token:", token);

 
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleClickOutside = (event) => {
    if (
      isSidebarOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target)
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleDrawerOpen = (doctor) => {
    setSelectedDoctor(doctor);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDeleteClick = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
const adminid= localStorage.getItem('adminId');
  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return; // Ensure there's a selected doctor
  
    const payload = {
      adminId: adminid, // Replace with dynamic adminId if needed
      doctorId: selectedDoctor._id, // Use the ID of the selected doctor
    };
  
    try {
      const response = await axios.post('http://localhost:9500/v1/dashboard-adminFlow/doctor-list-delete', payload, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the Bearer token here
        },
      });
  
      if (response.data.success) {
        console.log("Doctor deleted successfully:", response.data.message);
        fetchDoctors(); // Refresh the list of doctors
      } else {
        console.error("Error deleting doctor:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
    } finally {
      setOpenDeleteModal(false); // Close the delete modal
    }
  };
  
  

  // Fetch doctors data from API
  const fetchDoctors = async (query = "") => {
    try {
      const response = await axios.get(`http://localhost:9500/v1/dashboard-admin/search-doctor-and-patient-list?query=ch`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the Bearer token here
        },
      });
      setDoctors(response.data.searchResults);
      console.log(response.data);
      // Assuming the data is directly in the response
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors(); // Fetch doctors on component mount
  }, []);

  // Filter doctors based on the search term
 // Filter doctors based on the search term
const filteredDoctors = Array.isArray(doctors) && doctors.length > 0 
? doctors.filter((doctor) =>
  doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) // Change 'name' to 'firstName'
) 
: [];


  return (
    <div className="d-flex">
      <div className="w-15 w-md-0">
        <Sidebar
          isOpen={isSidebarOpen}
          sidebarRef={sidebarRef}
          activeLink={location.pathname}
        />
      </div>
      <div className="w-85 w-md-100">
        {/* Other parts of your component */}
        <div className="container-fluid doctor_management_page py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="doctor_management-title">Doctor Management</h2>
            <div className="d-flex align-items-center">
              <div className="doctor_management_search-container me-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Doctor"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    fetchDoctors(e.target.value); // Fetch doctors based on search term
                  }}
                />
                <img
                  src="/assets/images/search.svg"
                  alt="search"
                  className="search-icon"
                />
              </div>
              <button
                type="button"
                className="add-btn"
                onClick={() => navigate("/add-new-doctor")}
              >
                + Add New Doctor
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
  {loading ? (
    <div className="text-center">Loading...</div>
  ) : filteredDoctors.length === 0 ? (
    <div className="text-center">
      <img
        src="/assets/images/no-doctor-found-2.png"
        alt="No Data Found"
        className="img-fluid"
      />
    </div>
  ) : (
    <table className="table">
      <thead>
        <tr>
          <th className="rounded-end-0">Doctor Name</th>
          <th className="rounded-end-0 rounded-start-0">Gender</th>
          <th className="rounded-end-0 rounded-start-0">Qualification</th>
          <th className="rounded-end-0 rounded-start-0">Specialty</th>
          <th className="rounded-end-0 rounded-start-0">Working Time</th>
          <th className="rounded-end-0 rounded-start-0">Patient Check Up Time</th>
          <th className="rounded-end-0 rounded-start-0">Break Time</th>
          <th className="rounded-start-0">Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredDoctors.map((doctor, index) => (
          <tr key={index}>
            <td>
              <img
                src={doctor.image} // Ensure this property exists
                alt={doctor.firstName} // Use firstName for alt text
                className="me-3 img-fluid profile_img"
              />
              {doctor.firstName} {/* Display the doctor's first name */}
            </td>
            <td>
              <img
                src={`./assets/images/${doctor.gender}`} // Ensure the gender image matches your assets
                alt={doctor.firstName}
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                }}
                className="img-fluid"
              />
            </td>
            <td>{doctor.qualification}</td>
            <td>{doctor.specialistType}</td> {/* Ensure this matches your API response */}
            <td><div className="date-box">{doctor.workingTime}</div></td>
            <td><div className="date-box">{doctor.patientCheckUpTime}</div></td>
            <td><div className="date-box">{doctor.breakTime}</div></td>
            <td className="d-flex">
              <button type="button" className="edit-button me-3 bg-transparent" onClick={() => navigate(`/edit-doctor/${doctor._id}`)}>
                  <img src="/assets/images/edit-icon-box.svg" alt="edit-icon-box" className="img-fluid" />
              </button>
              <button type="button" className="view-button me-3 bg-transparent" onClick={() => handleDrawerOpen(doctor)}>
                  <img src="/assets/images/view-icon-box.svg" alt="view-icon-box" className="img-fluid" />
              </button>
              <button type="button" className="delete-button bg-transparent" onClick={() => handleDeleteClick(doctor)}>
                  <img src="/assets/images/delete-icon-box.svg" alt="delete-icon-box" className="img-fluid" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
        </div>
      </div>
      <DoctorDetailsDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        doctor={selectedDoctor}
      />
      <DeleteDoctorModal
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDeleteDoctor}
      />
    </div>
  );
};

export default DoctorManagement;
