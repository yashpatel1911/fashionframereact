import React, { useEffect, useState, useRef } from 'react';
import API_ENDPOINTS from '../../api/apiConfig';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // States & Cities
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityDisabled, setCityDisabled] = useState(true);

  // Image upload
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);

  // ── Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You are not logged in.');
        return;
      }
      try {
        const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok && data.data) {
          setProfile(data.data);
          setFormData(data.data);
          localStorage.setItem('pu_name', data.data.pu_name);
        } else {
          setError(data.message || 'Failed to fetch profile.');
        }
      } catch (err) {
        setError('An error occurred while fetching profile.');
      }
    };
    fetchProfile();
  }, []);

  // ── Fetch States (when edit mode opens)
  useEffect(() => {
    if (!isEditing) return;
    setStatesLoading(true);
    fetch(API_ENDPOINTS.GET_STATES, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.states)) {
          setStates(data.states);
        } else {
          setStates([]);
        }
        setStatesLoading(false);
      })
      .catch(() => {
        setStates([]);
        setStatesLoading(false);
      });
  }, [isEditing]);

  // ── Fetch Cities when state_id changes in formData
  useEffect(() => {
    if (!formData?.state_id) {
      setCities([]);
      setCityDisabled(true);
      return;
    }

    const fetchCities = async () => {
      setCityLoading(true);
      setCityDisabled(true);
      try {
        const res = await fetch(
          `${API_ENDPOINTS.GET_CITY}?state_id=${formData.state_id}`,
          { headers: { 'Content-Type': 'application/json' } }
        );
        const data = await res.json();
        let cityList = [];
        if (Array.isArray(data.cities)) cityList = data.cities;
        else if (Array.isArray(data.data)) cityList = data.data;
        setCities(cityList);
      } catch {
        setCities([]);
      } finally {
        setCityLoading(false);
        setCityDisabled(false);
      }
    };

    fetchCities();
  }, [formData?.state_id]);

  // ── Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Reset city if state changes
    if (name === 'state_id') {
      setFormData((prev) => ({ ...prev, state_id: value, city_id: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel — restore original
      setFormData(profile);
      setSaveError('');
      setSaveSuccess('');
      setImageError('');
    }
    setIsEditing(!isEditing);
  };

  // ── Save (PATCH update-profile)
  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const payload = {};
      if (formData.pu_name !== profile.pu_name) payload.pu_name = formData.pu_name;
      if (formData.pud_address !== profile.pud_address) payload.pud_address = formData.pud_address;
      if (formData.state_id !== profile.state_id) payload.state_id = formData.state_id;
      if (formData.city_id !== profile.city_id) payload.city_id = formData.city_id;

      const response = await fetch(API_ENDPOINTS.UPDATE_USER_PROFILE, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Merge updated data back into profile
        setProfile((prev) => ({ ...prev, ...data.data }));
        setFormData((prev) => ({ ...prev, ...data.data }));
        localStorage.setItem('pu_name', data.data.pu_name || formData.pu_name);
        setSaveSuccess('Profile updated successfully.');
        setIsEditing(false);
      } else {
        setSaveError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setSaveError('An error occurred while saving.');
    } finally {
      setSaveLoading(false);
    }
  };

  // ── Upload Image (POST upload-profile-image)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setImageError('Only JPEG, PNG, or WebP allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be under 5 MB.');
      return;
    }

    setImageError('');
    setImageUploading(true);

    const token = localStorage.getItem('authToken');
    const formDataImg = new FormData();
    formDataImg.append('profile_image', file);

    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD_PROFILE_IMAGE, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataImg,
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const newUrl = data.data.profile_image_url;
        setProfile((prev) => ({ ...prev, profile_image_url: newUrl }));
        setFormData((prev) => ({ ...prev, profile_image_url: newUrl }));
      } else {
        setImageError(data.message || 'Image upload failed.');
      }
    } catch {
      setImageError('An error occurred during upload.');
    } finally {
      setImageUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Delete Image (DELETE upload-profile-image)
  const handleImageDelete = async () => {
    if (!profile?.profile_image_url) return;
    const token = localStorage.getItem('authToken');
    setImageUploading(true);
    setImageError('');

    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD_PROFILE_IMAGE, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setProfile((prev) => ({ ...prev, profile_image_url: null }));
        setFormData((prev) => ({ ...prev, profile_image_url: null }));
      } else {
        setImageError(data.message || 'Failed to remove image.');
      }
    } catch {
      setImageError('An error occurred while removing image.');
    } finally {
      setImageUploading(false);
    }
  };

  const avatarSrc =
    profile?.profile_image_url ||
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  return (
    <main>
      <div className="container py-5 mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            <div className="card border-0 shadow-lg rounded-4 p-4">

              {/* HEADER */}
              <div className="d-flex align-items-center mb-4">

                {/* Avatar */}
                <div className="position-relative me-3" style={{ width: 80, height: 80 }}>
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #dee2e6',
                    }}
                  />
                  {imageUploading && (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle"
                      style={{ background: 'rgba(0,0,0,0.4)' }}
                    >
                      <div
                        className="spinner-border spinner-border-sm text-light"
                        role="status"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="mb-1">{profile?.pu_name}</h4>
                  <small className="text-muted">{profile?.pu_email}</small>
                </div>

                <button
                  className="btn btn-sm btn-primary ms-auto"
                  onClick={handleEditToggle}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {/* Image actions — only in edit mode */}
              {isEditing && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                  >
                    {imageUploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                  {profile?.profile_image_url && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleImageDelete}
                      disabled={imageUploading}
                    >
                      Remove Photo
                    </button>
                  )}
                  {imageError && (
                    <small className="text-danger">{imageError}</small>
                  )}
                </div>
              )}

              {/* Alerts */}
              {saveSuccess && (
                <div className="alert alert-success py-2">{saveSuccess}</div>
              )}
              {saveError && (
                <div className="alert alert-danger py-2">{saveError}</div>
              )}

              {error ? (
                <div className="alert alert-danger">{error}</div>
              ) : !profile ? (
                <LoadingSpinner />
              ) : (
                <>
                  {/* PROFILE INFO */}
                  <div className="mb-4">
                    <h5 className="mb-3">Profile Information</h5>

                    {!isEditing ? (
                      <div className="row g-3">
                        <div className="col-md-6">
                          <strong>Name:</strong> {profile.pu_name}
                        </div>
                        <div className="col-md-6">
                          <strong>Email:</strong> {profile.pu_email}
                        </div>
                        <div className="col-md-6">
                          <strong>Phone:</strong> {profile.pu_contact_no}
                        </div>
                        <div className="col-md-6">
                          <strong>Created:</strong> {profile.created_at}
                        </div>
                        <div className="col-md-6">
                          <strong>Status:</strong>{' '}
                          <span
                            className={`badge ${
                              profile.is_deactive ? 'bg-danger' : 'bg-success'
                            }`}
                          >
                            {profile.is_deactive ? 'Inactive' : 'Active'}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <strong>Address:</strong> {profile.pud_address || '—'}
                        </div>
                        <div className="col-md-6">
                          <strong>State:</strong> {profile.state_name || '—'}
                        </div>
                        <div className="col-md-6">
                          <strong>City:</strong> {profile.city_name || '—'}
                        </div>
                      </div>
                    ) : (
                      <div className="row g-3">

                        {/* Name */}
                        <div className="col-md-6">
                          <label className="form-label">Name</label>
                          <input
                            className="form-control"
                            name="pu_name"
                            value={formData.pu_name || ''}
                            onChange={handleChange}
                            placeholder="Name"
                          />
                        </div>

                        {/* Email — read only */}
                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input
                            className="form-control"
                            value={formData.pu_email || ''}
                            readOnly
                            disabled
                            placeholder="Email"
                          />
                        </div>

                        {/* Phone — read only */}
                        <div className="col-md-6">
                          <label className="form-label">Phone</label>
                          <input
                            className="form-control"
                            value={formData.pu_contact_no || ''}
                            readOnly
                            disabled
                            placeholder="Phone"
                          />
                        </div>

                        {/* Address */}
                        <div className="col-md-6">
                          <label className="form-label">Address</label>
                          <input
                            className="form-control"
                            name="pud_address"
                            value={formData.pud_address || ''}
                            onChange={handleChange}
                            placeholder="Address"
                          />
                        </div>

                        {/* State */}
                        <div className="col-md-6">
                          <label className="form-label">State</label>
                          <select
                            className="form-select"
                            name="state_id"
                            value={formData.state_id || ''}
                            onChange={handleChange}
                            disabled={statesLoading}
                          >
                            <option value="">
                              {statesLoading ? 'Loading states...' : 'Select State'}
                            </option>
                            {states.map((state) => (
                              <option key={state.state_id} value={state.state_id}>
                                {state.state_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* City */}
                        <div className="col-md-6">
                          <label className="form-label">City</label>
                          <select
                            className="form-select"
                            name="city_id"
                            value={formData.city_id || ''}
                            onChange={handleChange}
                            disabled={cityDisabled}
                          >
                            <option value="">
                              {cityLoading ? 'Loading cities...' : 'Select City'}
                            </option>
                            {cities.map((city) => (
                              <option key={city.city_id} value={city.city_id}>
                                {city.city_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Save */}
                        <div className="col-12">
                          <button
                            className="btn btn-success mt-2"
                            onClick={handleSave}
                            disabled={saveLoading}
                          >
                            {saveLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* CREATED BY */}
                  {profile.created_by && (
                    <div className="mt-4 pt-3 border-top">
                      <h5 className="mb-3">Created By</h5>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <strong>Username:</strong> {profile.created_by.username}
                        </div>
                        <div className="col-md-6">
                          <strong>Email:</strong> {profile.created_by.email}
                        </div>
                        <div className="col-md-6">
                          <strong>Full Name:</strong> {profile.created_by.fullname}
                        </div>
                        <div className="col-md-6">
                          <strong>Contact:</strong> {profile.created_by.ud_contact_no}
                        </div>
                        <div className="col-md-6">
                          <strong>Aadhaar:</strong> {profile.created_by.ud_aadhaar}
                        </div>
                        <div className="col-md-6">
                          <strong>PAN:</strong> {profile.created_by.ud_pan}
                        </div>
                        <div className="col-12">
                          <strong>Address:</strong> {profile.created_by.ud_address}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;