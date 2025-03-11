import React from 'react';

const Settings = () => {
  return (
    <div className="container py-5">
      <h1 className="h2 fw-bold text-primary mb-4">Settings</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card bg-dark border-custom">
            <div className="card-body">
              <h5 className="card-title text-primary mb-4">Account Settings</h5>
              <div className="mb-3">
                <label className="form-label text-secondary">Email Notifications</label>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="emailNotifications" />
                  <label className="form-check-label text-secondary" htmlFor="emailNotifications">Enable</label>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary">Push Notifications</label>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="pushNotifications" />
                  <label className="form-check-label text-secondary" htmlFor="pushNotifications">Enable</label>
                </div>
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 