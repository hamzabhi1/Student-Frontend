import React, { useState } from "react";
import "./StudentForm.css";

const StudentForm = ({ onSubmit, loading, initialData, onCancel }) => {
    const [form, setForm] = useState(
        initialData || {
            fullName: "",
            email: "",
            password: "",
            studentclass: "",
            isFeePaid: false,
            role: "student",
        }
    );
    const [profilePicture, setProfilePicture] = useState(null);
    const defaultBackend = import.meta.env.VITE_API_URL || 'https://student-backend-n8uc3a4f0-hamzabhi1s-projects.vercel.app';
    const [previewUrl, setPreviewUrl] = useState(
        initialData?.profilePicture ? `${defaultBackend}/uploads/${initialData.profilePicture}` : null
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // If no file selected, send as JSON like Signup
        if (!profilePicture) {
            const payload = {
                fullName: form.fullName,
                email: form.email,
                studentclass: form.studentclass,
                isFeePaid: form.isFeePaid,
                role: form.role,
            };
            
            // Only include password if creating new (not editing)
            if (!initialData && form.password) {
                payload.password = form.password;
            }
            
            console.log("Sending JSON payload:", payload);
            onSubmit(payload);
            return;
        }

        // If file selected, use FormData
        const formData = new FormData();
        formData.append("fullName", form.fullName);
        formData.append("email", form.email);
        if (form.password) formData.append("password", form.password);
        formData.append("studentclass", form.studentclass);
        formData.append("isFeePaid", form.isFeePaid);
        formData.append("role", form.role);
        formData.append("profilePicture", profilePicture);
        
        console.log("Sending FormData with file");
        onSubmit(formData);
    };

    return (
        <form className="student-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                        id="fullName"
                        name="fullName"
                        placeholder="Enter full name"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        id="email"
                        name="email"
                        placeholder="Enter email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                {!initialData && (
                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <input
                            id="password"
                            name="password"
                            placeholder="Enter password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="studentclass">Class *</label>
                    <input
                        id="studentclass"
                        name="studentclass"
                        placeholder="Enter class"
                        value={form.studentclass}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <input 
                        id="profilePicture"
                        type="file" 
                        name="profilePicture" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                    />
                </div>
                <div className="form-group checkbox-group">
                    <label>
                        <input
                            name="isFeePaid"
                            type="checkbox"
                            checked={form.isFeePaid}
                            onChange={handleChange}
                        />
                        Fee Paid
                    </label>
                </div>
            </div>

            {previewUrl && (
                <div className="form-row preview-section">
                    <div className="preview-container">
                        <label>Profile Picture Preview</label>
                        <img src={previewUrl} alt="Preview" className="preview-image" />
                    </div>
                </div>
            )}

            <div className="form-row form-actions">
                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : (initialData ? "💾 Update Student" : "➕ Add Student")}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} disabled={loading}>
                        ✕ Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default StudentForm;
