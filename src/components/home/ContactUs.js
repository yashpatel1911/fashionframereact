import React from 'react';
import '../../assets/contact.css';

const ContactUs = () => {
    return (
        <section className="contact-section">
            <div style={{ textAlign: 'center', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', maxWidth: '1400px', margin: '0 auto' }}>
                    <h2 className="contact-heading">Contact Us</h2>

                    <p className="contact-description">
                        We'd love to hear from you! If you have any questions or comments for us, fill out the form below we will get back to you within 48 hours.
                        Or feel free to write us at <a href="mailto:fashionframe2025@gmail.com" style={{ color: '#000' }}>fashionframe2025@gmail.com</a> or call us at +91 90333 18392.
                        We are available to take your calls on (10:00 am till 6:00 pm)
                    </p>
                </div>

                <div className="contact-info mb-4">
                    <div className="contact-info-item right-border">
                        <p>Manufactured, Packed & Marketed By:</p>
                        <p>Fashion Frame PVT LTD</p>
                    </div>

                    <div className="contact-info-item">
                        <p>Address</p>
                        <p>
                            Fashion Frame plot no 1126 Laxmi Textile Park Sachin GIDC Surat.
                        </p>
                    </div>

                    <div className="contact-info-item right-border">
                        <p>Customer Support</p>
                        <p>+91 90333 18392</p>
                    </div>

                    <div className="contact-info-item">
                        <p>Email</p>
                        <p>fashionframe2025@gmail.com</p>
                    </div>
                </div>
            </div>

            <div className="contact-form-wrapper">
                <h2 className="contact-heading">Contact</h2>

                <form className="contact-form">
                    <div className="form-row">
                        <div className="form-col">
                            <label>NAME</label>
                            <input type="text" />
                        </div>
                        <div className="form-col">
                            <label>EMAIL</label>
                            <input type="email" />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label>PHONE NUMBER</label>
                        <input type="text" />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label>MESSAGE</label>
                        <textarea rows="5"></textarea>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button type="submit" className="submit-btn">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ContactUs;
