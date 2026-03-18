import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";

const SubCategory = () => {

  const { c_slug } = useParams();

  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSubCategories = async () => {
      const token = localStorage.getItem('authToken');
      // if (!token) {
      //   setError('You must be logged in to view subcategories.');
      //   navigate('/login');
      //   return;
      // }

      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch(API_ENDPOINTS.SUBCATEGORY, {
          method: 'POST',
          headers,
          body: JSON.stringify({ c_slug: c_slug })
        });
        const data = await response.json();
        if (response.ok && data.status && Array.isArray(data.data)) {
          setSubCategories(data.data);
          setError('');
        } else if (data.message) {
          setSubCategories([]);
          setError(data.message);
        } else {
          setSubCategories([]);
          setError('Failed to fetch subcategories.');
        }
      } catch (err) {
        setSubCategories([]);
        setError('An error occurred while fetching subcategories.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [c_slug, navigate]);

  return (
    <main>
      <section className="page-header bg-light py-5" style={{ marginTop: '50px' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center mb-2">
                  <li className="breadcrumb-item"><Link to="/categories">Collection</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{c_slug}</li>
                </ol>
              </nav>
              <h2 className="text-center mb-0">
                {c_slug
                  .replace(/[-_]/g, " ")       // Replace dashes or underscores with spaces
                  .split(" ")                   // Split into words
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
                  .join(" ")} Collection
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="subcategories py-5">
        <div className="container">
          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}
          {loading ? (
            <div className="text-center text-muted">Loading...</div>
          ) : (
            <div className="row g-4">
              {subCategories.length > 0 ? (
                subCategories.map((subCat) => (
                  <div key={subCat.sc_id} className="col-md-6 col-lg-3" data-aos="fade-up">
                    <div className="subcategory-card">
                      <div className="image-holder position-relative mb-3">
                        <img
                          src={`${IMAGE_BASE_URL}${subCat.sc_image}`}
                          alt={subCat.sc_name}
                          className="img-fluid w-100"
                        />
                        <Link
                          to={`/products/${subCat.sc_slug}`}
                          className="stretched-link"
                        ></Link>
                      </div>
                      <div className="subcategory-content text-center">
                        <h3 className="subcategory-title h5 mb-2">{subCat.sc_name}</h3>
                        {subCat.product_count !== undefined && (
                          <p className="text-muted mb-0">{subCat.product_count} Products</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                !error && (
                  <div className="col-12 text-center text-muted">No subcategories found.</div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SubCategory;