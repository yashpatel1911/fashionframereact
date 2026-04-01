import React, { useEffect, useState, useRef } from 'react';
import API_ENDPOINTS from '../../api/apiConfig';
import '../../assets/css/profile.css';

const UserProfile = () => {
  const [profile, setProfile]       = useState(null);
  const [formData, setFormData]     = useState(null);
  const [error, setError]           = useState('');
  const [isEditing, setIsEditing]   = useState(false);
  const [saveLoading, setSaveLoading]   = useState(false);
  const [saveError, setSaveError]       = useState('');
  const [saveSuccess, setSaveSuccess]   = useState('');

  const [states, setStates]             = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [cities, setCities]             = useState([]);
  const [cityLoading, setCityLoading]   = useState(false);
  const [cityDisabled, setCityDisabled] = useState(true);

  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError]         = useState('');
  const fileInputRef = useRef(null);

  /* ── Fetch Profile ── */
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) { setError('You are not logged in.'); return; }
      try {
        const res  = await fetch(API_ENDPOINTS.USER_PROFILE, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setProfile(data.data);
          setFormData(data.data);
          localStorage.setItem('pu_name', data.data.pu_name);
        } else {
          setError(data.message || 'Failed to fetch profile.');
        }
      } catch { setError('An error occurred while fetching profile.'); }
    };
    fetchProfile();
  }, []);

  /* ── Fetch States ── */
  useEffect(() => {
    if (!isEditing) return;
    setStatesLoading(true);
    fetch(API_ENDPOINTS.GET_STATES, { headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then(d => { setStates(Array.isArray(d.states) ? d.states : []); setStatesLoading(false); })
      .catch(() => { setStates([]); setStatesLoading(false); });
  }, [isEditing]);

  /* ── Fetch Cities ── */
  useEffect(() => {
    if (!formData?.state_id) { setCities([]); setCityDisabled(true); return; }
    const fetchCities = async () => {
      setCityLoading(true); setCityDisabled(true);
      try {
        const res  = await fetch(`${API_ENDPOINTS.GET_CITY}?state_id=${formData.state_id}`,
          { headers: { 'Content-Type': 'application/json' } });
        const data = await res.json();
        setCities(Array.isArray(data.cities) ? data.cities : Array.isArray(data.data) ? data.data : []);
      } catch { setCities([]); }
      finally { setCityLoading(false); setCityDisabled(false); }
    };
    fetchCities();
  }, [formData?.state_id]);

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state_id') setFormData(p => ({ ...p, state_id: value, city_id: '' }));
    else setFormData(p => ({ ...p, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) { setFormData(profile); setSaveError(''); setSaveSuccess(''); setImageError(''); }
    setIsEditing(e => !e);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    setSaveLoading(true); setSaveError(''); setSaveSuccess('');
    try {
      const payload = {};
      if (formData.pu_name     !== profile.pu_name)     payload.pu_name     = formData.pu_name;
      if (formData.pud_address !== profile.pud_address) payload.pud_address = formData.pud_address;
      if (formData.state_id    !== profile.state_id)    payload.state_id    = formData.state_id;
      if (formData.city_id     !== profile.city_id)     payload.city_id     = formData.city_id;

      const res  = await fetch(API_ENDPOINTS.UPDATE_USER_PROFILE, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setProfile(p => ({ ...p, ...data.data }));
        setFormData(p => ({ ...p, ...data.data }));
        localStorage.setItem('pu_name', data.data.pu_name || formData.pu_name);
        setSaveSuccess('Profile updated successfully.');
        setIsEditing(false);
      } else {
        setSaveError(data.message || 'Failed to update profile.');
      }
    } catch { setSaveError('An error occurred while saving.'); }
    finally { setSaveLoading(false); }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(file.type)) {
      setImageError('Only JPEG, PNG, or WebP allowed.'); return;
    }
    if (file.size > 5 * 1024 * 1024) { setImageError('Image must be under 5 MB.'); return; }
    setImageError(''); setImageUploading(true);
    const token = localStorage.getItem('authToken');
    const fd = new FormData();
    fd.append('profile_image', file);
    try {
      const res  = await fetch(API_ENDPOINTS.UPLOAD_PROFILE_IMAGE, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        const url = data.data.profile_image_url;
        setProfile(p => ({ ...p, profile_image_url: url }));
        setFormData(p => ({ ...p, profile_image_url: url }));
      } else { setImageError(data.message || 'Image upload failed.'); }
    } catch { setImageError('An error occurred during upload.'); }
    finally { setImageUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleImageDelete = async () => {
    if (!profile?.profile_image_url) return;
    const token = localStorage.getItem('authToken');
    setImageUploading(true); setImageError('');
    try {
      const res  = await fetch(API_ENDPOINTS.UPLOAD_PROFILE_IMAGE, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setProfile(p => ({ ...p, profile_image_url: null }));
        setFormData(p => ({ ...p, profile_image_url: null }));
      } else { setImageError(data.message || 'Failed to remove image.'); }
    } catch { setImageError('An error occurred while removing image.'); }
    finally { setImageUploading(false); }
  };

  const avatarSrc = profile?.profile_image_url ||
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  return (
    <main className="lux-profile-page">

      {/* Page Header */}
      <div className="lux-profile-header">
        <p className="lux-profile-sub">Your account</p>
        <h1 className="lux-profile-title">My Profile</h1>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            {error ? (
              <div className="lux-alert error">{error}</div>
            ) : !profile ? (
              <div className="lux-profile-loading">Loading your profile</div>
            ) : (
              <div className="lux-profile-card">

                {/* ── Avatar Row ── */}
                <div className="lux-avatar-section">
                  <div className="lux-avatar-wrap">
                    <img src={avatarSrc} alt="avatar" className="lux-avatar" />
                    {imageUploading && (
                      <div className="lux-avatar-uploading">
                        <div className="lux-avatar-spinner" />
                      </div>
                    )}
                  </div>

                  <div className="lux-avatar-info">
                    <div className="lux-avatar-name">{profile.pu_name}</div>
                    <div className="lux-avatar-email">{profile.pu_email}</div>
                    <span className={`lux-status-badge ${profile.is_deactive ? 'inactive' : 'active'}`}>
                      {profile.is_deactive ? 'Inactive' : 'Active'}
                    </span>
                  </div>

                  <button
                    className={`lux-edit-toggle${isEditing ? ' cancel' : ''}`}
                    onClick={handleEditToggle}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {/* ── Image actions ── */}
                {isEditing && (
                  <div className="lux-img-actions">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <button
                      className="lux-img-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageUploading}
                    >
                      {imageUploading ? 'Uploading…' : 'Upload Photo'}
                    </button>
                    {profile.profile_image_url && (
                      <button
                        className="lux-img-btn danger"
                        onClick={handleImageDelete}
                        disabled={imageUploading}
                      >
                        Remove Photo
                      </button>
                    )}
                    {imageError && <span className="lux-img-error">{imageError}</span>}
                  </div>
                )}

                {/* ── Alerts ── */}
                {saveSuccess && <div className="lux-alert success">{saveSuccess}</div>}
                {saveError   && <div className="lux-alert error">{saveError}</div>}

                {/* ── Profile Info ── */}
                <div className="lux-section-block">
                  <div className="lux-section-heading">Profile Information</div>

                  {!isEditing ? (
                    <div className="lux-info-grid">
                      <div className="lux-info-item">
                        <div className="lux-info-label">Full Name</div>
                        <div className="lux-info-value">{profile.pu_name}</div>
                      </div>
                      <div className="lux-info-item">
                        <div className="lux-info-label">Email</div>
                        <div className="lux-info-value">{profile.pu_email}</div>
                      </div>
                      <div className="lux-info-item">
                        <div className="lux-info-label">Phone</div>
                        <div className="lux-info-value">{profile.pu_contact_no || '—'}</div>
                      </div>
                      <div className="lux-info-item">
                        <div className="lux-info-label">Member Since</div>
                        <div className="lux-info-value">{profile.created_at || '—'}</div>
                      </div>
                      <div className="lux-info-item">
                        <div className="lux-info-label">State</div>
                        <div className="lux-info-value">{profile.state_name || '—'}</div>
                      </div>
                      <div className="lux-info-item">
                        <div className="lux-info-label">City</div>
                        <div className="lux-info-value">{profile.city_name || '—'}</div>
                      </div>
                      <div className="lux-info-item full">
                        <div className="lux-info-label">Address</div>
                        <div className="lux-info-value">{profile.pud_address || '—'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="lux-form-grid">
                      {/* Name */}
                      <div className="lux-form-group">
                        <label className="lux-form-label">Full Name</label>
                        <input
                          className="lux-form-input"
                          name="pu_name"
                          value={formData.pu_name || ''}
                          onChange={handleChange}
                          placeholder="Your name"
                        />
                      </div>

                      {/* Email — read only */}
                      <div className="lux-form-group">
                        <label className="lux-form-label">Email</label>
                        <input
                          className="lux-form-input"
                          value={formData.pu_email || ''}
                          readOnly
                          disabled
                        />
                      </div>

                      {/* Phone — read only */}
                      <div className="lux-form-group">
                        <label className="lux-form-label">Phone</label>
                        <input
                          className="lux-form-input"
                          value={formData.pu_contact_no || ''}
                          readOnly
                          disabled
                        />
                      </div>

                      {/* Address */}
                      <div className="lux-form-group">
                        <label className="lux-form-label">Address</label>
                        <input
                          className="lux-form-input"
                          name="pud_address"
                          value={formData.pud_address || ''}
                          onChange={handleChange}
                          placeholder="Your address"
                        />
                      </div>

                      {/* State */}
                      <div className="lux-form-group">
                        <label className="lux-form-label">State</label>
                        <select
                          className="lux-form-select"
                          name="state_id"
                          value={formData.state_id || ''}
                          onChange={handleChange}
                          disabled={statesLoading}
                        >
                          <option value="">{statesLoading ? 'Loading…' : 'Select State'}</option>
                          {states.map(s => (
                            <option key={s.state_id} value={s.state_id}>{s.state_name}</option>
                          ))}
                        </select>
                      </div>

                      {/* City */}
                      <div className="lux-form-group">
                        <label className="lux-form-label">City</label>
                        <select
                          className="lux-form-select"
                          name="city_id"
                          value={formData.city_id || ''}
                          onChange={handleChange}
                          disabled={cityDisabled}
                        >
                          <option value="">{cityLoading ? 'Loading…' : 'Select City'}</option>
                          {cities.map(c => (
                            <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Save */}
                      <div className="lux-form-group full">
                        <button
                          className="lux-save-btn"
                          onClick={handleSave}
                          disabled={saveLoading}
                        >
                          {saveLoading ? 'Saving…' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Created By ── */}
                {profile.created_by && (
                  <div className="lux-section-block">
                    <div className="lux-section-heading">Vendor Information</div>
                    <div className="lux-info-grid">
                      <div className="lux-info-item">
                        <div className="lux-info-label">Username</div>
                        <div className="lux-info-value">{profile.created_by.username}</div>
                      </div>
                      <div className="lux-info-item">
                        <div className="lux-info-label">Email</div>
                        <div className="lux-info-value">{profile.created_by.email}</div>
                      </div>
                      <div className="lux-info-item">
                        <div className="lux-info-label">Full Name</div>
                        <div className="lux-info-value">{profile.created_by.fullname}</div>
                      </div>
                      <div className="lux-info-item">
                        <div className="lux-info-label">Contact</div>
                        <div className="lux-info-value">{profile.created_by.ud_contact_no}</div>
                      </div>
                      <div className="lux-info-item">
                        <div className="lux-info-label">Aadhaar</div>
                        <div className="lux-info-value">{profile.created_by.ud_aadhaar}</div>
                      </div>
                      <div className="lux-info-item">
                        <div className="lux-info-label">PAN</div>
                        <div className="lux-info-value">{profile.created_by.ud_pan}</div>
                      </div>
                      <div className="lux-info-item full">
                        <div className="lux-info-label">Address</div>
                        <div className="lux-info-value">{profile.created_by.ud_address}</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;