/**
 * Address Validator Utility
 * Follows SRP - Single responsibility of validating address data
 * Follows DRY - Reusable validation functions
 */

export interface AddressValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validate complete address string
 * @param address - The address string to validate
 * @returns Validation result with message
 */
export const validateAddressString = (address: string): AddressValidationResult => {
  if (!address || address.trim().length === 0) {
    return {
      isValid: false,
      message: "Address is required",
    };
  }

  if (address.trim().length < 10) {
    return {
      isValid: false,
      message: "Address is too short. Please provide a complete address",
    };
  }

  if (address.trim().length > 500) {
    return {
      isValid: false,
      message: "Address is too long. Maximum 500 characters allowed",
    };
  }

  return {
    isValid: true,
    message: "Address is valid",
  };
};

/**
 * Validate Indian pincode
 * @param pincode - The pincode to validate
 * @returns Validation result with message
 */
export const validatePincode = (pincode: string): AddressValidationResult => {
  if (!pincode || pincode.trim().length === 0) {
    return {
      isValid: false,
      message: "Pincode is required",
    };
  }

  // Remove any spaces or special characters
  const cleanPincode = pincode.replace(/\s+/g, "").replace(/[^0-9]/g, "");

  if (cleanPincode.length !== 6) {
    return {
      isValid: false,
      message: "Pincode must be exactly 6 digits",
    };
  }

  // Check if it's a valid number
  const pincodeNumber = parseInt(cleanPincode, 10);
  if (isNaN(pincodeNumber)) {
    return {
      isValid: false,
      message: "Pincode must contain only numbers",
    };
  }

  // Indian pincodes range from 110001 to 855118
  if (pincodeNumber < 100000 || pincodeNumber > 999999) {
    return {
      isValid: false,
      message: "Please enter a valid Indian pincode",
    };
  }

  return {
    isValid: true,
    message: "Pincode is valid",
  };
};

/**
 * Validate complete address with pincode
 * @param address - The address string
 * @param pincode - The pincode string
 * @returns Combined validation result
 */
export const validateAddress = (
  address: string,
  pincode: string
): AddressValidationResult => {
  // Validate address
  const addressValidation = validateAddressString(address);
  if (!addressValidation.isValid) {
    return addressValidation;
  }

  // Validate pincode
  const pincodeValidation = validatePincode(pincode);
  if (!pincodeValidation.isValid) {
    return pincodeValidation;
  }

  return {
    isValid: true,
    message: "Address and pincode are valid",
  };
};

/**
 * Check if user has complete address
 * @param userData - User data object
 * @returns Boolean indicating if user has address
 */
export const hasCompleteAddress = (userData: {
  address?: string;
  pincode?: string;
} | null): boolean => {
  if (!userData) return false;
  
  return !!(
    userData.address &&
    userData.address.trim().length > 0 &&
    userData.pincode &&
    userData.pincode.trim().length === 6
  );
};

/**
 * Sanitize address string
 * Removes extra spaces and trims
 * @param address - Address to sanitize
 * @returns Sanitized address
 */
export const sanitizeAddress = (address: string): string => {
  return address
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\n+/g, ", "); // Replace newlines with commas
};

/**
 * Sanitize pincode
 * Removes spaces and non-numeric characters
 * @param pincode - Pincode to sanitize
 * @returns Sanitized pincode
 */
export const sanitizePincode = (pincode: string): string => {
  return pincode.replace(/\s+/g, "").replace(/[^0-9]/g, "");
};
