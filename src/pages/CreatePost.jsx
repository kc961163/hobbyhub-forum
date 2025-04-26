// src/pages/CreatePost.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { createPost } from '../services/postService';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    flags: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      const newPost = await createPost(formData);
      setIsSubmitting(false);
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setIsSubmitting(false);
      setErrors({
        ...errors,
        submit: 'Failed to create post. Please try again.'
      });
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a New Post</h1>
      
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
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;