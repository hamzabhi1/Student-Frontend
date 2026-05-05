import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./HomePage.css";
import useFetch from "../hooks/useFetch";
import useSubmit from "../hooks/useSubmit";
import StudentForm from "../components/StudentForm";
import "./StudentsSection.css";

const HomePage = () => {

  const { token, userdata } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Profile fetch
  const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useFetch("/api/auth/profile", { isAuth: true });
  // Students fetch
  const { data: studentsData, loading: studentsLoading, refetch: refetchStudents } = useFetch("/api/auth/students", { isAuth: true });

  // Submit hooks for add, update, delete
  const { submit: submitStudent, loading: submitLoading } = useSubmit({ isAuth: true });
  const { submit: updateStudent, loading: updateLoading } = useSubmit({ isAuth: true });
  const { submit: deleteStudent, loading: deleteLoading } = useSubmit({ isAuth: true });

  // UI state
  const [showAdd, setShowAdd] = useState(false);
  const [editStudent, setEditStudent] = useState(null);


  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!userdata && profileLoading) {
    return (
      <main className="home-page">
        <h2>Loading your profile...</h2>
      </main>
    );
  }
  if (!userdata && !profileLoading && !profileData) {
    return <Navigate to="/login" replace />;
  }
  // Fallback: If Redux hasn't updated yet, use local 'data'
  const activeUser = userdata || profileData?.user || profileData;

  const initials = activeUser?.fullName
    ? activeUser.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
    : "NA";

  const joinedDate = activeUser?.createdAt
    ? new Date(activeUser.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    : "Not available";

  // --- Student Management Handlers ---
  const handleAddStudent = async (form) => {
    const res = await submitStudent("/register", form);
    if (res?.ok) {
      setShowAdd(false);
      refetchStudents();
    }
  };
  const handleEditStudent = (student) => setEditStudent(student);
  const handleUpdateStudent = async (form) => {
    const res = await updateStudent(`/student/${editStudent.id || editStudent._id}`, form, { method: "PUT" });
    if (res?.ok) {
      setEditStudent(null);
      refetchStudents();
    }
  };
  const handleDeleteStudent = async (student) => {
    if (!window.confirm("Delete this student?")) return;
    const res = await deleteStudent(`/student/${student.id || student._id}`, {}, { method: "DELETE" });
    if (res?.ok) refetchStudents();
  };

  return (
    <main className="home-page">
      {/* --- User Profile Section --- */}
      <section className="profile-hero">
        <div className="profile-avatar">
          {activeUser?.profilePicture ? (
            <img 
              src={`http://localhost:4000/uploads/${activeUser.profilePicture}`} 
              alt={activeUser?.fullName}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            initials
          )}
        </div>
        <div className="profile-intro">
          <p className="profile-label">Welcome back</p>
          <h1>{activeUser?.fullName || "User"}</h1>
          <p className="profile-meta">{activeUser?.email}</p>
          <p className="profile-date">Joined {joinedDate}</p>
        </div>
      </section>

      {/* --- Student Management Section --- */}
      <section className="students-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2>👥 Manage Students</h2>
          <button className="btn-primary" onClick={() => setShowAdd((v) => !v)}>
            {showAdd ? "✕ Close" : "+ Add Student"}
          </button>
        </div>
        
        {showAdd && (
          <div className="form-container">
            <StudentForm onSubmit={handleAddStudent} loading={submitLoading} />
          </div>
        )}
        
        {editStudent && (
          <div className="form-container">
            <h3>Edit Student</h3>
            <StudentForm
              onSubmit={handleUpdateStudent}
              loading={updateLoading}
              initialData={editStudent}
              onCancel={() => setEditStudent(null)}
            />
          </div>
        )}
        
        {studentsLoading ? (
          <div className="loading">Loading students...</div>
        ) : (
          <div className="table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Fee Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentsData?.students?.length ? (
                  studentsData.students.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="student-avatar">
                          {student.profilePicture ? (
                            <img 
                              src={`http://localhost:4000/uploads/${student.profilePicture}`}
                              alt={student.fullName}
                            />
                          ) : (
                            <div className="avatar-initials">
                              {student.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td><strong>{student.fullName}</strong></td>
                      <td>{student.email}</td>
                      <td>{student.studentclass}</td>
                      <td>
                        <span className={`fee-badge ${student.isFeePaid ? 'paid' : 'pending'}`}>
                          {student.isFeePaid ? '✓ Paid' : '⏳ Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => handleEditStudent(student)}>
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteStudent(student)} 
                            disabled={deleteLoading}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      No students found. Click "Add Student" to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;