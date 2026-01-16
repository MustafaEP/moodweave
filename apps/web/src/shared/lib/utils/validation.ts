/**
 * Validate if text is not empty and has minimum length
 */
export const validateText = (text: string, minLength: number = 10): boolean => {
  return text.trim().length >= minLength;
};

