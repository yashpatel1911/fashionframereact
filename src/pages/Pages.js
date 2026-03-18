import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_ENDPOINTS from '../api/apiConfig'; // your API base config

// Utility to decode HTML entities
function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

const Pages = ({ token }) => {
  const { slug } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = `${API_ENDPOINTS.GET_PAGES}?slug=${slug}`;

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError('');

      try {
        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: headers,
        });

        const data = await response.json();

        if (response.ok && data.status) {
          setTitle(data.page.page_title);
          setDescription(decodeHtml(data.page.page_description)); // decode here
        } else {
          setError(data.message || 'Page not found.');
          setDescription('<p>Page not found.</p>');
        }
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('An error occurred while fetching the page.');
        setDescription('<p>Error loading page.</p>');
      }

      setLoading(false);
    };

    fetchPage();
  }, [slug, token]);

  return (
    <section className="page-section py-5">
      <div style={{ textAlign: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        {/* <h2 className="contact-heading">{title || slug.replace(/-/g, ' ')}</h2> */}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div
            className="page-description py-5"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </section>
  );
};

export default Pages;
