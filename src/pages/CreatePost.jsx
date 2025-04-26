// src/pages/CreatePost.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loading from '../components/ui/Loading';
import { createPost } from '../services/postService';

const CreatePost = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    flags: []
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Clear error for this field when user types
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };
  
  // Handle checkbox changes for flags
  const handleFlagChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        flags: [...formData.flags, value]
      });
    } else {
      setFormData({
        ...formData,
        flags: formData.flags.filter(flag => flag !== value)
      });
    }
  };
  
  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    // Title is required
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    // Validate image URL format if provided
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Simple URL validation
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset status states
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the createPost service
      const newPost = await createPost({
        title: formData.title,
        content: formData.content || null,
        imageUrl: formData.imageUrl || null,
        flags: formData.flags.length > 0 ? formData.flags : []
      });
      
      setSubmitSuccess(true);
      
      // Redirect to the new post after a brief delay
      setTimeout(() => {
        navigate(`/post/${newPost.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating post:', error);
      setSubmitError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create a New Post</h1>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Post created successfully! Redirecting to your new post...
        </div>
      )}
      
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          id="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter post title"
          required={true}
          error={errors.title}
        />
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content (optional)
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Share your thoughts"
            className={`px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full`}
            rows={5}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>
        
        <Input
          label="Image URL (optional)"
          id="imageUrl"
          type="text"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Enter image URL"
          error={errors.imageUrl}
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Post Type (optional)
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value="Question"
                checked={formData.flags.includes('Question')}
                onChange={handleFlagChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2">Question</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value="Opinion"
                checked={formData.flags.includes('Opinion')}
                onChange={handleFlagChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2">Opinion</span>
            </label>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth={true}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <Loading size="small" color="white" />
              <span className="ml-2">Creating Post...</span>
            </div>
          ) : (
            'Create Post'
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;