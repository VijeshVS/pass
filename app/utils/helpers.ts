// Extract the event ID from URL parameters
export const getEventIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('event_id');
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};