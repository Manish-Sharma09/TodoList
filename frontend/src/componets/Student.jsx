import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Student = () => {
  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({
    Name: "",
    Email: "",
    DOB: "",
    Address: "",
  });
  const [editingID, setEditingID] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [marksheet, setMarksheet] = useState(null);
  const [editPhoto, setEditPhoto] = useState(null);
  const [editMarksheet, setEditMarksheet] = useState(null);

  // New Data Created
  const [newData, setNewData] = useState({
    Name: "",
    Email: "",
    DOB: "",
    Address: "",
  });

  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  // Define state for viewing student details
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Update the input values for creating new data
  const handleNewDataChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const getAllData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/data");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleDelete = async (ID) => {
    try {
      await axios.delete(`http://localhost:5000/api/data/${ID}`);
      setData((prevData) => prevData.filter((item) => item.ID !== ID));
    } catch (error) {
      console.log(error);
    }
  };

  // opening the edit modal
  const handleEditOpen = (student) => {
    setEditingID(student.ID);
    setEditFormData(student);
  };

  // closing the edit modal
  const handleEditClose = () => {
    setEditingID(null);
    setEditFormData({
      Name: "",
      Email: "",
      DOB: "",
      Address: "",
    });
  };

  const clearSetPhoto1 = useRef(null);
  const clearSetMarksheet2 = useRef(null);

  // updating student details
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("Name", editFormData.Name);
      formData.append("Email", editFormData.Email);
      formData.append("DOB", editFormData.DOB);
      formData.append("Address", editFormData.Address);
      formData.append("photo", editPhoto);
      formData.append("marksheet", editMarksheet);

      await axios.put(`http://localhost:5000/api/data/${editingID}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      getAllData();
      handleEditClose();
      clearSetPhoto1.current.value = "";
      clearSetMarksheet2.current.value = "";
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const clearSetPhoto = useRef(null);
  const clearSetMarksheet = useRef(null);
  // creating new data
  const handleCreateData = async () => {
    // Check if any of the required fields are empty
    if (!newData.Name || !newData.Email || !newData.DOB || !newData.Address) {
      alert("Please fill in all required fields.");
      return; // Do not proceed with the submission
    }
    const formData = new FormData();
    formData.append("Name", newData.Name);
    formData.append("Email", newData.Email);
    formData.append("DOB", newData.DOB);
    formData.append("Address", newData.Address);
    formData.append("photo", photo);
    formData.append("marksheet", marksheet);
    console.log("formData", formData);

    try {
      await axios.post("http://localhost:5000/api/data", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      getAllData();
      // Clear the form
      setNewData({
        Name: "",
        Email: "",
        DOB: "",
        Address: "",
      });
      clearSetPhoto.current.value = "";
      clearSetMarksheet.current.value = "";
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  //input change for search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // opening the view student modal
  const handleViewOpen = (student) => {
    setSelectedStudent(student);
  };

  // closing the view student modal
  const handleViewClose = () => {
    setSelectedStudent(null);
  };

  return (
    <>
      <div style={{ marginTop: "20px", textAlign: "center", color: "black" }}>
        <h1 className="text-light">STUDENT DETAILS WEB APPLICATION</h1>
      </div>

      <div className="main_section">
        <div className="p-3 set_width">
          <div className="sar_btn">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />

        
          </div>

          <div
            className="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                {/* Add Student Form */}
                <div className="container">
                  <form id="contact">
                    <h3>Create Students Details</h3>

                    <input
                      placeholder="Your Name"
                      type="text"
                      name="Name"
                      value={newData.Name}
                      onChange={handleNewDataChange}
                      required
                      autoFocus
                    />

                    <input
                      placeholder="Your Email Address"
                      type="email"
                      name="Email"
                      value={newData.Email}
                      onChange={handleNewDataChange}
                      required
                    />

                    <input
                      className="inpt_dob"
                      placeholder="Your Date Of Birth"
                      type="date"
                      name="DOB"
                      value={newData.DOB}
                      onChange={handleNewDataChange}
                      required
                    />

                    <textarea
                      placeholder="Your Address...."
                      name="Address"
                      value={newData.Address}
                      onChange={handleNewDataChange}
                      required
                    ></textarea>

                    <input
                      className="type_file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      ref={clearSetPhoto}
                    />

                    <input
                      className="type_file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setMarksheet(e.target.files[0])}
                      ref={clearSetMarksheet}
                    />

                    <button
                      className="btn btn-primary  btn_gren"
                      type="button"
                      name="submit"
                      id="contact-submit"
                      data-submit="...Sending"
                      onClick={handleCreateData}
                      data-bs-dismiss="modal"
                    >
                      Create Student
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Student Modal */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="container">
                    <form id="contact" onSubmit={handleEditSubmit}>
                      <h3>Update Students Details</h3>
                      <input
                        placeholder="Your Name"
                        type="text"
                        name="Name"
                        value={editFormData.Name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            Name: e.target.value,
                          })
                        }
                        required
                        autoFocus
                      />
                      <input
                        placeholder="Your Email Address"
                        type="email"
                        name="Email"
                        value={editFormData.Email}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            Email: e.target.value,
                          })
                        }
                        required
                      />
                      <input
                        className="inpt_dob"
                        placeholder="Your Date Of Birth"
                        type="date"
                        name="DOB"
                        value={editFormData.DOB}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            DOB: e.target.value,
                          })
                        }
                        required
                      />
                      <textarea
                        placeholder="Your Address"
                        name="Address"
                        value={editFormData.Address}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            Address: e.target.value,
                          })
                        }
                        required
                      />
                      <h4>Professional Certifications</h4>
                      <input
                        className="type_file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditPhoto(e.target.files[0])}
                        ref={clearSetPhoto1}
                      />

                      <input
                        className="type_file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setEditMarksheet(e.target.files[0])}
                        ref={clearSetMarksheet2}
                      />
                      <button
                        name="submit"
                        type="submit"
                        id="contact-submit"
                        data-submit="...Sending"
                        data-bs-dismiss="modal"
                      >
                        Update Details
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Table Deatils */}

          <table className="table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>DOB</th>
                <th style={{ width: "40%" }}>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((item) =>
                  item.Name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item, id) => (
                  <tr key={id}>
                    <td>{id + 1}</td>
                    <td>{item.Name}</td>
                    <td>{item.Email}</td>
                    <td>{item.DOB}</td>
                    <td>{item.Address}</td>
                    <td className="action_btn">
                      <i
                        className="zmdi zmdi-delete del_icon"
                        onClick={() => handleDelete(item.ID)}
                      />
                      &nbsp;
                      <i
                        className="zmdi zmdi-edit edit_icon"
                        onClick={() => handleEditOpen(item)}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      />
                      &nbsp;
                      <i
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal2"
                        className="zmdi zmdi-eye view_icon"
                        onClick={() => handleViewOpen(item)}
                      />
                      <div
                        className="modal fade"
                        id="exampleModal2"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={handleViewClose}
                              ></button>
                            </div>
                            <div className="container">
                              <h3>View Student Details</h3>
                              <div>
                                <div>
                                  {selectedStudent && (
                                    <div>
                                      <table
                                        border="1"
                                        cellpadding="8"
                                        className="tab_di"
                                      >
                                        <tr>
                                          <th
                                            rowspan="11"
                                            style={{ width: "100px" }}
                                          >
                                            <img
                                              src={`http://localhost:5000${selectedStudent.photo_url}`}
                                              alt={selectedStudent.Name}
                                              style={{
                                                width: "100%",
                                                maxWidth: "100px",
                                              }}
                                            />
                                          </th>
                                          <th>Name:</th>
                                          <td colspan="3">
                                            {selectedStudent.Name}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>Email:</th>
                                          <td colspan="3">
                                            {selectedStudent.Email}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>DOB:</th>
                                          <td colspan="3">
                                            {selectedStudent.DOB}
                                          </td>
                                        </tr>
                                      </table>

                                      <p className="address_bdr">
                                        Address: {selectedStudent.Address}
                                      </p>

                                      <p className="para_btn">
                                        <a
                                          href={`http://localhost:5000${selectedStudent.marksheet_url}`}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          View Marksheet
                                        </a>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              ADD NEW STUDENT
            </button>
        </div>
      </div>
    </>
  );
};

export default Student;
