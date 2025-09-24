// import { IPledge, IPledgePublicResponse } from '@donation-hub/types';

/**
 * Masks personally identifiable information for public display
 */
export const maskPII = (pledge: any): any => {
  return {
    _id: pledge._id,
    fullName: pledge.fullName, 
    amount: pledge.amount,
    message: pledge.message,
    createdAt: pledge.createdAt,
  };
};

/**
 * Masks a name by showing only the first letter and last letter
 * Example: "John Doe" -> "J***e"
 */
export const maskName = (name: string): string => {
  if (!name || name.length <= 2) {
    return name;
  }

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    // Single name: show first and last character
    const singleName = parts[0];
    if (singleName.length <= 2) {
      return singleName;
    }
    return singleName[0] + '*'.repeat(singleName.length - 2) + singleName[singleName.length - 1];
  }

  // Multiple names: mask each part
  return parts.map(part => {
    if (part.length <= 2) {
      return part;
    }
    return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
  }).join(' ');
};

/**
 * Masks an email address
 * Example: "john.doe@example.com" -> "j***@example.com"
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email;
  }

  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return email;
  }

  const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
  return `${maskedLocal}@${domain}`;
};

/**
 * Masks a phone number
 * Example: "+1234567890" -> "+1***7890"
 */
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length <= 4) {
    return phone;
  }

  const start = phone.slice(0, 2);
  const end = phone.slice(-4);
  const middle = '*'.repeat(phone.length - 6);
  
  return `${start}${middle}${end}`;
};

/**
 * Sanitizes text input by removing potentially harmful content
 */
export const sanitizeText = (text: string): string => {
  if (!text) return text;
  
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
};

