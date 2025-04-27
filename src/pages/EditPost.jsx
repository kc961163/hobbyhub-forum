// src/pages/EditPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getPostById, updatePost } from '../services/postService';
import { useUser } from '../context/UserContext';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useUser();
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    flags: []
  });
  
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unauthorizedError, setUnauthorizedError] = useState(false);

  useEffect(() => {
    if (formData.imageUrl && isValidUrl(formData.imageUrl)) {
      setImagePreview(formData.imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [formData.imageUrl]);
  
  useEffect(() => {
    fetchPost();
  }, [id]);
  
  const fetchPost = async () => {
    try {
      const post = await getPostById(id);
      
      // Check if user is authorized to edit this post
      if (post.author_id !== userId) {
        setUnauthorizedError(true);
        return;
      }
      
      setFormData({
        title: post.title || '',
        content: post.content || '',
        imageUrl: post.image_url || '',
        flags: post.flags || []
      });
      
    } catch (err) {
      console.error('Error fetching post:', err);
      setErrors({
        ...errors,
        fetch: 'Failed to load post. It may have been deleted or the connection failed.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleFlagToggle = (flag) => {
    const currentFlags = [...formData.flags];
    const index = currentFlags.indexOf(flag);
    
    if (index !== -1) {
      // Remove flag if already selected
      currentFlags.splice(index, 1);
    } else {
      // Add flag if not selected
      currentFlags.push(flag);
    }
    
    setFormData({
      ...formData,
      flags: currentFlags
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Optional fields validation
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl,
        flags: formData.flags
      };
      
      const updatedPost = await updatePost(id, postData);
      console.log('Updated post response:', updatedPost); // Debug logging
      
      if (!updatedPost) {
        throw new Error('No response received from update operation');
      }
      
      setIsSubmitting(false);
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error.message || error);
      setIsSubmitting(false);
      setErrors({
        ...errors,
        submit: `Failed to update post: ${error.message || 'Unknown error'}`
      });
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading post...</p>
      </div>
    );
  }
  
  if (unauthorizedError) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <p className="font-bold">Unauthorized</p>
          <p>You do not have permission to edit this post.</p>
        </div>
        <Button
          onClick={() => navigate(`/post/${id}`)}
          variant="secondary"
        >
          Return to Post
        </Button>
      </div>
    );
  }
  
  if (errors.fetch) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {errors.fetch}
        </div>
        <Button
          onClick={() => navigate('/')}
          variant="secondary"
        >
          Return to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      
      {errors.submit && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Post Title"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          error={errors.title}
          placeholder="Give your post a title"
        />

{formData.imageUrl && (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Image Preview
    </label>
    {imagePreview ? (
      <img 
        src={imagePreview} 
        alt="Preview" 
        className="max-h-60 rounded border border-gray-300"
        onError={() => {
          setImagePreview(null);
          setErrors({...errors, imageUrl: 'Unable to load image. Please check the URL.'});
        }} 
      />
    ) : (
      <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center text-gray-500">
        {formData.imageUrl ? 'Invalid image URL' : 'No image URL provided'}
      </div>
    )}
  </div>
)}
        
        <div className="mb-4">
          <label 
            htmlFor="content" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows="5"
            value={formData.content}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full"
            placeholder="Share your thoughts, ideas, or questions..."
          />
        </div>
        
        <Input
          label="Image URL (optional)"
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          error={errors.imageUrl}
          placeholder="https://example.com/image.jpg"
        />
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Post Type (optional)
          </label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={formData.flags.includes('Question') ? 'primary' : 'secondary'}
              size="small"
              onClick={() => handleFlagToggle('Question')}
            >
              Question
            </Button>
            <Button
              type="button"
              variant={formData.flags.includes('Opinion') ? 'primary' : 'secondary'}
              size="small"
              onClick={() => handleFlagToggle('Opinion')}
            >
              Opinion
            </Button>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/post/${id}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;