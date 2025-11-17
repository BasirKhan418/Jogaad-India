import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { uploadImage as uploadImageToS3 } from '../employee/employeeApiService';

export interface CategoryData {
  _id: string;
  categoryName: string;
  categoryType: 'Service' | 'Maintenance';
  categoryDescription?: string;
  categoryUnit?: string;
  recommendationPrice: number;
  categoryMinPrice?: number;
  categoryMaxPrice?: number;
  categoryStatus: boolean;
  img?: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  address: string;
  phone: string;
  pincode: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  img?: string;
  categoryid: string;
  payrate: number;
  customDescription?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  order?: any;
  redirect?: boolean;
}

export type SignupStep = 'personal' | 'service' | 'optional';

export interface UseFieldExecAddEmployeeReturn {
  loading: boolean;
  uploadingImage: boolean;
  error: string;
  success: string;
  formData: EmployeeFormData;
  categories: CategoryData[];
  selectedCategory: CategoryData | null;
  imagePreview: string;
  priceError: string;
  step: SignupStep;
  
  setFormData: (data: EmployeeFormData) => void;
  clearMessages: () => void;
  resetForm: () => void;
  setStep: (step: SignupStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  fetchCategories: () => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCategorySelect: (categoryId: string) => void;
  handleImageUpload: (file: File) => Promise<void>;
  submitAddEmployee: () => Promise<boolean>;
  
  isFormValid: boolean;
  isStepValid: boolean;
}

const initialFormData: EmployeeFormData = {
  name: '',
  email: '',
  address: '',
  phone: '',
  pincode: '',
  bankName: '',
  bankAccountNumber: '',
  bankIfscCode: '',
  img: '',
  categoryid: '',
  payrate: 0,
  customDescription: ''
};

export const useFieldExecAddEmployee = (): UseFieldExecAddEmployeeReturn => {
  const [step, setStep] = useState<SignupStep>('personal');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [priceError, setPriceError] = useState('');
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);


  const verifyPayment = useCallback(async (razorpayResponse: any, orderId: string, email: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          email
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Payment verified! Employee added successfully.');
        setSuccess('Employee added successfully! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/field-executive/dashboard';
        }, 1500);
      } else {
        toast.error(result.message || 'Payment verification failed. Please contact support.');
      }
    } catch (error) {
      toast.error('Failed to verify payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  }, []);

 
  const initiateRazorpayPayment = useCallback((order: any, email: string) => {
    // Check if Razorpay is loaded
    if (typeof window === 'undefined' || !(window as any).Razorpay) {
      toast.error('Payment system not loaded. Please refresh the page.');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      amount: order.amount,
      image: "https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png",
      currency: order.currency,
      name: 'Jogaad India',
      description: 'Employee Registration Fee',
      order_id: order.id,
      prefill: {
        email: email,
        name: formData.name,
        contact: formData.phone
      },
      theme: {
        color: '#2B9EB3'
      },
      handler: function (response: any) {
        verifyPayment(response, order.id, email);
      },
      modal: {
        ondismiss: function() {
          toast.info('Payment cancelled. Employee can complete it later from their profile.');
          setLoading(false);
        }
      }
    };

    const razorpayInstance = new (window as any).Razorpay(options);
    razorpayInstance.open();
  }, [formData.name, formData.phone, verifyPayment]);

  // Load Razorpay script on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
    setPriceError('');
  }, []);

  const validatePrice = useCallback((price: number): boolean => {
    // Skip validation for Others category
    if (!formData.categoryid || formData.categoryid === '' || formData.categoryid === 'others') {
      setPriceError('');
      return true;
    }

    if (!selectedCategory) {
      setPriceError('Please select a category first');
      return false;
    }

    const minPrice = selectedCategory.categoryMinPrice || 0;
    const maxPrice = selectedCategory.categoryMaxPrice || 0;

    if (price < minPrice) {
      setPriceError(`Price must be at least ₹${minPrice.toLocaleString()}`);
      return false;
    }

    if (price > maxPrice) {
      setPriceError(`Price cannot exceed ₹${maxPrice.toLocaleString()}`);
      return false;
    }

    setPriceError('');
    return true;
  }, [selectedCategory, formData.categoryid]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSelectedCategory(null);
    setStep('personal');
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview('');
    clearMessages();
    setLoading(false);
  }, [imagePreview, clearMessages]);


  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/category');
      const result: any = await response.json();

      // API returns categories in 'categories' property, not 'data'
      if (result.success && result.categories) {
        const activeCategories = result.categories.filter((cat: CategoryData) => cat.categoryStatus === true);
        setCategories(activeCategories);
        if (activeCategories.length === 0) {
          toast.warning('No active categories found. Please contact admin.');
        }
      } else {
        toast.error('Failed to load categories. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error loading categories. Please check your connection.');
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [id]: type === 'number' ? parseFloat(value) || 0 : value
      };

      // Validate price if payrate changes
      if (id === 'payrate') {
        validatePrice(parseFloat(value) || 0);
      }

      return updated;
    });

    clearMessages();
  }, [validatePrice, clearMessages]);

  /**
   * Handle category selection
   */
  const handleCategorySelect = useCallback((categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryid: categoryId }));
    
    if (categoryId === 'others') {
      setSelectedCategory(null);
      setPriceError('');
      clearMessages();
      return;
    }

    const category = categories.find(cat => cat._id === categoryId);
    if (category) {
      setSelectedCategory(category);
      // Set recommended price as default
      setFormData(prev => ({ 
        ...prev, 
        categoryid: categoryId,
        payrate: category.recommendationPrice 
      }));
      validatePrice(category.recommendationPrice);
    }
    
    clearMessages();
  }, [categories, validatePrice, clearMessages]);

  /**
   * Handle image upload to S3
   */
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Upload to S3
      const uploadResult = await uploadImageToS3(file);
      
      if (uploadResult.success && uploadResult.data?.fileURL) {
        setFormData(prev => ({ ...prev, img: uploadResult.data!.fileURL }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(uploadResult.message || 'Failed to upload image');
        setImagePreview('');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Error uploading image');
      setImagePreview('');
    } finally {
      setUploadingImage(false);
    }
  }, []);

  /**
   * Submit employee registration
   * Uses field executive API endpoint
   */
  const submitAddEmployee = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      clearMessages();

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.address) {
        setError('Please fill in all required fields');
        setLoading(false);
        return false;
      }

      if (!formData.categoryid) {
        setError('Please select a service category');
        setLoading(false);
        return false;
      }

      if (formData.categoryid === 'others' && !formData.customDescription) {
        setError('Please describe your service');
        setLoading(false);
        return false;
      }

      // Validate price for non-others categories
      if (formData.categoryid !== 'others' && !validatePrice(formData.payrate)) {
        setLoading(false);
        return false;
      }

      abortControllerRef.current = new AbortController();

      // Call field executive add employee API
      const response = await fetch('/api/v1/field-e/addemployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Map 'others' to empty string for backend compatibility if needed
          categoryid: formData.categoryid === 'others' ? '' : formData.categoryid,
        }),
        signal: abortControllerRef.current.signal,
      });

      const result: ApiResponse = await response.json();

      if (!result.success) {
        setError(result.message || 'Failed to create employee account');
        setLoading(false);
        return false;
      }

      // Check if redirect is needed (employee already exists and paid)
      if (result.redirect) {
        setError('Employee account already exists and is active');
        setLoading(false);
        return false;
      }

      // If order exists, initiate payment
      if (result.order) {
        toast.success('Employee account created! Processing payment...');
        initiateRazorpayPayment(result.order, formData.email);
        return true;
      }

      // Success without payment
      setSuccess('Employee account created successfully!');
      toast.success('Employee added successfully!');
      
      // Reset form after success
      setTimeout(() => {
        resetForm();
      }, 2000);
      
      setLoading(false);
      return true;

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
      } else {
        console.error('Employee creation error:', error);
        setError('Failed to create employee account. Please try again.');
      }
      setLoading(false);
      return false;
    }
  }, [formData, validatePrice, initiateRazorpayPayment, resetForm, clearMessages]);

  /**
   * Navigate to next step
   */
  const nextStep = useCallback(() => {
    if (step === 'personal') {
      setStep('service');
    } else if (step === 'service') {
      setStep('optional');
    }
  }, [step]);

  /**
   * Navigate to previous step
   */
  const prevStep = useCallback(() => {
    if (step === 'optional') {
      setStep('service');
    } else if (step === 'service') {
      setStep('personal');
    }
  }, [step]);

  /**
   * Check if current step is valid
   */
  const isStepValid = (() => {
    switch (step) {
      case 'personal':
        return !!(
          formData.name &&
          formData.email &&
          formData.phone &&
          formData.address &&
          formData.pincode &&
          formData.pincode.length === 6
        );
      case 'service':
        if (!formData.categoryid) return false;
        if (formData.categoryid === 'others') {
          return !!formData.customDescription;
        }
        return formData.payrate > 0 && !priceError;
      case 'optional':
        return true;
      default:
        return false;
    }
  })();

  /**
   * Check if entire form is valid
   */
  const isFormValid = !!(
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.address &&
    formData.pincode &&
    formData.categoryid &&
    (formData.categoryid === 'others' ? formData.customDescription : formData.payrate > 0) &&
    !priceError
  );

  return {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    categories,
    selectedCategory,
    imagePreview,
    priceError,
    step,
    setFormData,
    clearMessages,
    resetForm,
    setStep,
    nextStep,
    prevStep,
    fetchCategories,
    handleInputChange,
    handleCategorySelect,
    handleImageUpload,
    submitAddEmployee,
    isFormValid,
    isStepValid
  };
};
