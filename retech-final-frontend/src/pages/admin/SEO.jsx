import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";

import Sidebar from '../../components/admin/sidebar';

const SEO = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seoComponents, setSeoComponents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSEO, setCurrentSEO] = useState(null);

  useEffect(() => {
    const verifySeller = async () => {
      if (!sellerId) {
        navigate('/seller/login');
        return;
      }

      try {
        const response = await fetch('https://api.merabestie.com/admin/verify-seller', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sellerId })
        });

        const data = await response.json();
        
        if (data.loggedIn === 'loggedin') {
          fetchSEOComponents();
        } else {
          navigate('/seller/login');
        }
      } catch (error) {
        console.error('Error verifying seller:', error);
        navigate('/seller/login');
      }
    };

    verifySeller();
  }, [sellerId, navigate]);

  const fetchSEOComponents = async () => {
    try {
      const response = await fetch('https://api.merabestie.com/seo/getSEOComponents');
      const data = await response.json();
      if (Array.isArray(data)) {
        setSeoComponents(data);
      } else {
        console.error('Failed to fetch SEO components');
      }
    } catch (error) {
      console.error('Error fetching SEO components:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedSEOComponents = React.useMemo(() => {
    let sortableComponents = [...seoComponents];
    if (sortConfig.key !== null) {
      sortableComponents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableComponents;
  }, [seoComponents, sortConfig]);

  const filteredSEOComponents = sortedSEOComponents.filter(component => 
    component.pageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSEO = async (formData) => {
    try {
      const response = await fetch('https://api.merabestie.com/seo/saveSEOComponents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        fetchSEOComponents();
        setIsAddDialogOpen(false);
      } else {
        console.error('Failed to add SEO component');
      }
    } catch (error) {
      console.error('Error adding SEO component:', error);
    }
  };

  const handleEditSEO = async (formData) => {
    try {
      const response = await fetch('https://api.merabestie.com/seo/editSEOComponents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        fetchSEOComponents();
        setIsEditDialogOpen(false);
      } else {
        console.error('Failed to edit SEO component');
      }
    } catch (error) {
      console.error('Error editing SEO component:', error);
    }
  };

  const handleDeleteSEO = async (pageName) => {
    try {
      const response = await fetch(`https://api.merabestie.com/seo/deleteSEOComponents?pageName=${pageName}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setSeoComponents(seoComponents.filter(component => component.pageName !== pageName));
      } else {
        console.error('Failed to delete SEO component');
      }
    } catch (error) {
      console.error('Error deleting SEO component:', error);
    }
  };

  const SEOForm = ({ initialData, onSubmit, dialogTitle }) => {
    const [formData, setFormData] = useState(initialData || {
      pageName: '',
      title: '',
      description: '',
      keywords: '',
      author: '',
      robots: '',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogUrl: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="seo-form">
        <h2>{dialogTitle}</h2>
        <p>Fill in the SEO details for the page.</p>
        <div className="form-grid">
          <div>
            <label htmlFor="pageName">Page Name</label>
            <input id="pageName" name="pageName" value={formData.pageName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="full-width">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="keywords">Keywords</label>
            <input id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="author">Author</label>
            <input id="author" name="author" value={formData.author} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="robots">Robots</label>
            <input id="robots" name="robots" value={formData.robots} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="canonical">Canonical URL</label>
            <input id="canonical" name="canonical" value={formData.canonical} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="ogTitle">OG Title</label>
            <input id="ogTitle" name="ogTitle" value={formData.ogTitle} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="ogDescription">OG Description</label>
            <input id="ogDescription" name="ogDescription" value={formData.ogDescription} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="ogImage">OG Image</label>
            <input id="ogImage" name="ogImage" value={formData.ogImage} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="ogUrl">OG URL</label>
            <input id="ogUrl" name="ogUrl" value={formData.ogUrl} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="twitterTitle">Twitter Title</label>
            <input id="twitterTitle" name="twitterTitle" value={formData.twitterTitle} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="twitterDescription">Twitter Description</label>
            <input id="twitterDescription" name="twitterDescription" value={formData.twitterDescription} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="twitterImage">Twitter Image</label>
            <input id="twitterImage" name="twitterImage" value={formData.twitterImage} onChange={handleChange} />
          </div>
        </div>
        <div className="form-footer">
          <button type="submit">Save Changes</button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex">
      <Helmet>
        <title>SEO Management | Admin | Mera Bestie</title>
      </Helmet>
      <Sidebar />
      <div className="flex-1 p-8 ml-[5rem] lg:ml-64 bg-pink-50 min-h-screen">
        <div className="mb-6 flex justify-between items-center">
          <div className="relative">
            <div className={`flex items-center ${isSearchExpanded ? 'w-full md:w-64' : 'w-10 md:w-64'} transition-all duration-300`}>
              <button 
                className="md:hidden absolute left-2 z-10"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search by page name or title..."
                className={`search-input ${
                  isSearchExpanded ? 'w-full opacity-100' : 'w-0 md:w-full opacity-0 md:opacity-100'
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button className="add-seo-button" onClick={() => setIsAddDialogOpen(true)}>
            Add SEO
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-pink-100">
              <tr>
                {['pageName', 'title', 'description', 'keywords', 'author', 'robots', 'canonical', 'ogTitle', 'ogDescription', 'ogImage', 'ogUrl', 'twitterTitle', 'twitterDescription', 'twitterImage'].map((key) => (
                  <th key={key} onClick={() => handleSort(key)} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                    <div className="flex items-center">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSEOComponents.map((component) => (
                <tr key={component._id}>
                  {['pageName', 'title', 'description', 'keywords', 'author', 'robots', 'canonical', 'ogTitle', 'ogDescription', 'ogImage', 'ogUrl', 'twitterTitle', 'twitterDescription', 'twitterImage'].map((key) => (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {component[key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="edit-button" onClick={() => { setCurrentSEO(component); setIsEditDialogOpen(true); }}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteSEO(component.pageName)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddDialogOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsAddDialogOpen(false)}>&times;</span>
            <SEOForm onSubmit={handleAddSEO} dialogTitle="Add SEO Component" />
          </div>
        </div>
      )}

      {isEditDialogOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsEditDialogOpen(false)}>&times;</span>
            <SEOForm initialData={currentSEO} onSubmit={handleEditSEO} dialogTitle="Edit SEO Component" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SEO;

