/**
 * Utility function to check if a timestamp is within 12 hours from now
 * Follows SRP - Single responsibility of time validation
 * @param timestamp - ISO timestamp string or Date object
 * @returns boolean - true if within 12 hours, false otherwise
 */
export const isWithin12Hours = (timestamp: string | Date): boolean => {
  const createdAt = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - createdAt.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  return diffInHours <= 12;
};

/**
 * Format date to readable string
 * @param timestamp - ISO timestamp string or Date object
 * @returns Formatted date string
 */
export const formatDate = (timestamp: string | Date): string => {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date with time
 * @param timestamp - ISO timestamp string or Date object
 * @returns Formatted date and time string
 */
export const formatDateTime = (timestamp: string | Date): string => {
  return new Date(timestamp).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param timestamp - ISO timestamp string or Date object
 * @returns Relative time string
 */
export const getRelativeTime = (timestamp: string | Date): string => {
  const createdAt = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - createdAt.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return formatDate(timestamp);
};
