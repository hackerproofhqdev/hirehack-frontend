// utils/date.ts
import { formatDistanceToNow } from 'date-fns';

export const safeDateDistance = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    return `${formatDistanceToNow(date)} ago`;
  } catch (error) {
    return 'Recently';
  }
};