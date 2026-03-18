import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to view categories.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.CATEGORY, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (response.ok && data.status && Array.isArray(data.data)) {
          setCategories(data.data);
          setError('');
        } else if (data.message) {
          setCategories([]);
          setError(data.message);
        } else {
          setCategories([]);
          setError('Failed to fetch categories.');
        }
      } catch (err) {
        setCategories([]);
        setError('An error occurred while fetching categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  // Handler to navigate to subcategory page
  const handleCategoryClick = (category) => {
    navigate(`/subcategory/${category.c_id}`, { state: { categoryName: category.c_name } });
  };

  return (
    <main>
      <section className="page-header bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="page-title text-center mb-0 font-heading">Shop by Category</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-grid py-5">
        <div className="container">
          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}
          {loading ? (
            <div className="text-center text-muted">Loading...</div>
          ) : (
            <div className="row g-4">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.c_id} className="col-lg-4" data-aos="fade-up">
                    <div className="category-card">
                      <div
                        className="image-holder position-relative"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCategoryClick(category)}
                        title={`View ${category.c_name} Subcategories`}
                      >
                        <img
                          src={`${IMAGE_BASE_URL}${category.c_image}`}
                          alt={category.c_name}
                          className="img-fluid w-100" style={{height:"450px"}}
                        />
                      </div>
                      <div className="category-content text-center p-4">
                        <h3 className="category-title h4 mb-3">{category.c_name}</h3>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                !error && (
                  <div className="col-12 text-center text-muted">No categories found.</div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Categories;