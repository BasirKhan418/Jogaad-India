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
  othersCategory?: string;
  description?: string;
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
  awaitingOtp: boolean;
  otp: string;
  otpLoading: boolean;
  resendTimer: number;
  canResend: boolean;
  
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
  sendOtp: () => Promise<boolean>;
  verifyOtp: () => Promise<boolean>;
  setOtp: (val: string) => void;
  
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
  othersCategory: '',
  description: ''
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
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

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
      description: 'Service Provider Registration Fee',
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

  // Handle resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

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
      // Comprehensive validation before submission
      if (!formData.name || formData.name.trim().length < 2) {
        setError('Please provide a valid name (minimum 2 characters)');
        toast.error('Please provide a valid name');
        setLoading(false);
        return false;
      }

      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please provide a valid email address');
        toast.error('Please provide a valid email address');
        setLoading(false);
        return false;
      }

      if (!formData.phone || formData.phone.length < 10) {
        setError('Please provide a valid phone number (minimum 10 digits)');
        toast.error('Please provide a valid phone number');
        setLoading(false);
        return false;
      }

      if (!formData.address || formData.address.trim().length < 10) {
        setError('Please provide a complete address (minimum 10 characters)');
        toast.error('Please provide a complete address');
        setLoading(false);
        return false;
      }

      if (!formData.pincode || formData.pincode.length !== 6 || !/^\d{6}$/.test(formData.pincode)) {
        setError('Please provide a valid 6-digit pincode');
        toast.error('Please provide a valid 6-digit pincode');
        setLoading(false);
        return false;
      }

      if (!formData.categoryid || formData.categoryid === '') {
        setError('Please select a service category or choose "Others" for custom service');
        toast.error('Service category is required');
        setLoading(false);
        return false;
      }

      if (formData.categoryid === 'others') {
        if (!formData.description || formData.description.trim().length < 10) {
          setError('Please provide a detailed service description (minimum 10 characters)');
          toast.error('Service description must be at least 10 characters');
          setLoading(false);
          return false;
        }
      } else {
        if (!formData.payrate || formData.payrate <= 0) {
          setError('Please enter a valid service rate');
          toast.error('Service rate is required');
          setLoading(false);
          return false;
        }
        
        if (!validatePrice(formData.payrate)) {
          toast.error(priceError || 'Invalid price range');
          setLoading(false);
          return false;
        }
      }

      abortControllerRef.current = new AbortController();

      // Prepare payload - remove categoryid if it's empty or 'others'
      const payload: any = { ...formData };
      
      // Remove categoryid if it's empty or 'others' to avoid MongoDB cast error
      if (!payload.categoryid || payload.categoryid === '' || payload.categoryid === 'others') {
        delete payload.categoryid;
      }
      
      // Remove description if categoryid is present (not a custom service)
      if (payload.categoryid && payload.description) {
        delete payload.description;
        delete payload.othersCategory;
      }

      // Call field executive add employee API
      const response = await fetch('/api/v1/field-e/addemployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
      setAwaitingOtp(true);
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
    setAwaitingOtp(false);
  }, [step]);

  // Send OTP using public endpoint
  const sendOtp = useCallback(async (): Promise<boolean> => {
    if (!formData.email) {
      toast.error('Please enter email to send OTP');
      return false;
    }
    setOtpLoading(true);
    try {
      const res = await fetch(`/api/v1/otp?email=${encodeURIComponent(formData.email)}`, { method: 'GET' });
      const data = await res.json();
      if (data.success) {
        toast.success('OTP sent to email');
        setCanResend(false);
        setResendTimer(60);
        setTimeout(() => setCanResend(true), 60000);
        return true;
      }
      toast.error(data.message || 'Failed to send OTP');
      return false;
    } catch (e) {
      toast.error('Network error sending OTP');
      return false;
    } finally {
      setOtpLoading(false);
    }
  }, [formData.email]);

  // Verify OTP using public endpoint
  const verifyOtp = useCallback(async (): Promise<boolean> => {
    if (!formData.email || !otp || otp.length !== 6) {
      toast.error('Enter the 6-digit OTP');
      return false;
    }
    setOtpLoading(true);
    try {
      const res = await fetch('/api/v1/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('OTP verified');
        setAwaitingOtp(false);
        setStep('service');
        return true;
      }
      toast.error(data.message || 'Invalid OTP');
      return false;
    } catch (e) {
      toast.error('Network error verifying OTP');
      return false;
    } finally {
      setOtpLoading(false);
    }
  }, [formData.email, otp]);

  /**
   * Check if current step is valid
   */
  const isStepValid = (() => {
    switch (step) {
      case 'personal':
        return !!(
          formData.name &&
          formData.name.trim().length >= 2 &&
          formData.email &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
          formData.phone &&
          formData.phone.length >= 10 &&
          formData.address &&
          formData.address.trim().length >= 10 &&
          formData.pincode &&
          formData.pincode.length === 6 &&
          /^\d{6}$/.test(formData.pincode)
        );
      case 'service':
        // Must have a category selected
        if (!formData.categoryid || formData.categoryid === '') return false;
        
        // For custom service (others), must have description
        if (formData.categoryid === 'others') {
          return !!(formData.description && formData.description.trim().length >= 10);
        }
        
        // For regular categories, must have valid payrate
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
    (formData.categoryid === 'others' ? formData.description : formData.payrate > 0) &&
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
    awaitingOtp,
    otp,
    otpLoading,
    resendTimer,
    canResend,
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
    sendOtp,
    verifyOtp,
    setOtp,
    isFormValid,
    isStepValid
  };
};
