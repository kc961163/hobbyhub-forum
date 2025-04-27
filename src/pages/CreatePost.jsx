// src/pages/CreatePost.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { createPost } from '../services/postService';

const CreatePost = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    flags: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.imageUrl && isValidUrl(formData.imageUrl)) {
      setImagePreview(formData.imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [formData.imageUrl]);
  
  const handleChange = (e) => {
    console.log('Form change event:', e.target.name, e.target.value);
    
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [name]: value
      };
      console.log('Updated form data:', newData);
      return newData;
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
  
  // Enhance the validateForm function
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.title.trim()) {
    newErrors.title = 'Title is required';
  } else if (formData.title.length > 100) {
    newErrors.title = 'Title must be less than 100 characters';
  } else if (formData.title.length < 3) {
    newErrors.title = 'Title must be at least 3 characters';
  }
  
  // Optional fields validation
  if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
    newErrors.imageUrl = 'Please enter a valid URL (e.g., https://example.com/image.jpg)';
  }
  
  // Content validation (optional but good UX)
  if (formData.content && formData.content.length > 5000) {
    newErrors.content = 'Content must be less than 5000 characters';
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
  {isSubmitting ? (
    <div className="flex items-center">
      <div className="w-4 h-4 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin mr-2"></div>
      Creating...
    </div>
  ) : (
    'Create Post'
  )}
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