import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { uploadImage as uploadImageToS3 } from './employeeApiService';

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

export interface EmployeeSignupRequest {
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

export interface UseEmployeeSignupReturn {
  loading: boolean;
  uploadingImage: boolean;
  error: string;
  success: string;
  formData: EmployeeSignupRequest;
  categories: CategoryData[];
  selectedCategory: CategoryData | null;
  imagePreview: string;
  priceError: string;
  step: SignupStep;
  
  setFormData: (data: EmployeeSignupRequest) => void;
  clearMessages: () => void;
  resetForm: () => void;
  setStep: (step: SignupStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  fetchCategories: () => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCategorySelect: (categoryId: string) => void;
  handleImageUpload: (file: File) => Promise<void>;
  submitSignup: () => Promise<boolean>;
  
  isFormValid: boolean;
  isStepValid: boolean;
}

const initialFormData: EmployeeSignupRequest = {
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

export const useEmployeeSignup = (): UseEmployeeSignupReturn => {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>('personal');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [priceError, setPriceError] = useState('');
  const [formData, setFormData] = useState<EmployeeSignupRequest>(initialFormData);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Verify payment on backend after Razorpay success
   */
  const verifyPayment = useCallback(async (razorpayResponse: any, orderId: string) => {
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
          email: formData.email
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Payment verified! Your account is now active.');
        setSuccess('Payment successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/employee/login');
        }, 2000);
      } else {
        toast.error(result.message || 'Payment verification failed. Please contact support.');
      }
    } catch (error) {
      toast.error('Failed to verify payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  }, [formData.email, router]);

  /**
   * Initialize Razorpay payment
   * Opens Razorpay checkout modal for payment processing
   */
  const initiateRazorpayPayment = useCallback((order: any, email: string) => {
    // Check if Razorpay is loaded
    if (typeof window === 'undefined' || !(window as any).Razorpay) {
      toast.error('Payment system not loaded. Please refresh the page.');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      amount: order.amount,
      image:"https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png",
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
        // Payment successful - verify on backend
        verifyPayment(response, order.id);
      },
      modal: {
        ondismiss: function() {
          toast.info('Payment cancelled. You can complete it later from your profile.');
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
      document.body.removeChild(script);
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
    // Skip validation for Others category (empty categoryid means custom service)
    if (!formData.categoryid || formData.categoryid === '') {
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
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [clearMessages, imagePreview]);

  const nextStep = useCallback(() => {
    if (step === 'personal') {
      setStep('service');
    } else if (step === 'service') {
      setStep('optional');
    }
    clearMessages();
  }, [step, clearMessages]);

  const prevStep = useCallback(() => {
    if (step === 'optional') {
      setStep('service');
    } else if (step === 'service') {
      setStep('personal');
    }
    clearMessages();
  }, [step, clearMessages]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate price when category or payrate changes
  useEffect(() => {
    if (selectedCategory && formData.payrate > 0) {
      validatePrice(formData.payrate);
    } else {
      setPriceError('');
    }
  }, [selectedCategory, formData.payrate, validatePrice]);

  const fetchCategories = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/v1/category', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: abortControllerRef.current.signal
      });

      const result = await response.json();
      
      if (result.success && result.categories) {
        // Filter only active categories
        const activeCategories = result.categories.filter((cat: CategoryData) => cat.categoryStatus);
        setCategories(activeCategories);
      } else {
        toast.error(result.message || 'Failed to fetch categories');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      toast.error('Failed to fetch categories');
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, name, value, type } = e.target;
    const fieldName = name || id; // Use name if available, fallback to id
    
    if (type === 'number') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [fieldName]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: value }));
    }
    
    clearMessages();
  }, [clearMessages]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    setSelectedCategory(category || null);
    setFormData(prev => ({ 
      ...prev, 
      categoryid: categoryId === 'others' ? '' : categoryId,
      payrate: category?.recommendationPrice || 0,
      customDescription: categoryId === 'others' ? prev.customDescription : ''
    }));
    clearMessages();
  }, [categories, clearMessages]);

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

    // Create preview
    const preview = URL.createObjectURL(file);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(preview);

    // Upload image
    setUploadingImage(true);
    try {
      const result = await uploadImageToS3(file);
      if (result.success && result.data?.fileURL) {
        setFormData(prev => ({ ...prev, img: result.data!.fileURL }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload image');
        setImagePreview('');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      setImagePreview('');
    } finally {
      setUploadingImage(false);
    }
  }, [imagePreview]);

  const submitSignup = useCallback(async (): Promise<boolean> => {
    clearMessages();

    // Validate required fields
    if (!formData.name || formData.name.trim().length === 0) {
      toast.error('Please enter your name');
      return false;
    }

    if (!formData.email) {
      toast.error('Please enter your email');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number (at least 10 digits)');
      return false;
    }

    if (!formData.pincode || formData.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }

    if (!formData.address || formData.address.trim().length === 0) {
      toast.error('Please enter your address');
      return false;
    }

    if (!formData.categoryid) {
      toast.error('Please select a service category');
      return false;
    }

    if (formData.categoryid === 'others' && (!formData.customDescription || formData.customDescription.trim().length === 0)) {
      toast.error('Please describe your service category');
      return false;
    }

    if (!formData.payrate || formData.payrate <= 0) {
      toast.error('Please enter a valid service rate');
      return false;
    }

    // Validate price range
    if (!validatePrice(formData.payrate)) {
      return false;
    }

    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/v1/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: abortControllerRef.current.signal
      });

      const result = await response.json();
      
      if (result.success) {
        // Scenario 1: Account exists and is already paid - redirect to login
        if (result.redirect) {
          toast.success('Account Already Exists!', {
            description: 'Your employee account is already active. Redirecting you to the dashboard...',
            duration: 3000,
          });
          setSuccess('Account already exists and is active! Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/employee/dashboard');
          }, 2000);
          return true;
        }

        // Scenario 2 & 3: Account needs payment (existing unpaid or new account)
        if (result.order) {
          const isExistingAccount = result.message?.toLowerCase().includes('exists');
          
          if (isExistingAccount) {
            toast.info('Account Found!', {
              description: 'Your account exists but payment is pending. Redirecting you to complete payment...',
              duration: 3000,
            });
            setSuccess('Account found! Completing payment to activate your account...');
          } else {
            toast.success('Account Created!', {
              description: 'Please complete payment to activate your account',
              duration: 3000,
            });
            setSuccess('Account created! Proceeding to payment...');
          }
          
          // Initialize Razorpay payment
          setTimeout(() => {
            initiateRazorpayPayment(result.order, formData.email);
          }, 1000);
          return true;
        }

        // Fallback success case
        toast.success(result.message || 'Account created successfully');
        setSuccess(result.message || 'Account created successfully');
        
        setTimeout(() => {
          resetForm();
        }, 2000);
        
        return true;
      } else {
        const errorMsg = result.message || 'Failed to create account';
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false;
      }
      
      const errorMsg = 'Network error occurred. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, validatePrice, clearMessages, resetForm, router]);

  const isStepValid = useMemo(() => {
    if (step === 'personal') {
      return !!(
        formData.name &&
        formData.email &&
        formData.phone &&
        formData.phone.length >= 10 &&
        formData.pincode &&
        formData.pincode.length === 6 &&
        formData.address
      );
    }
    if (step === 'service') {
      return !!(
        formData.categoryid &&
        formData.payrate > 0 &&
        !priceError &&
        (formData.categoryid !== 'others' || (formData.customDescription && formData.customDescription.trim().length > 0))
      );
    }
    return true; // optional step is always valid
  }, [step, formData, priceError]);

  const isFormValid = !!(
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.phone.length >= 10 &&
    formData.pincode &&
    formData.pincode.length === 6 &&
    formData.address &&
    formData.categoryid &&
    formData.payrate > 0 &&
    !priceError &&
    (formData.categoryid !== 'others' || (formData.customDescription && formData.customDescription.trim().length > 0))
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
    submitSignup,
    
    isFormValid,
    isStepValid
  };
};
