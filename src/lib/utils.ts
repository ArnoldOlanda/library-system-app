import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapPermissions(permissions: string[]) {
  return permissions.map((permission) => {
    const splited = permission.split(':');
    return { action: splited[0], subject: splited[1] };
  });
}
