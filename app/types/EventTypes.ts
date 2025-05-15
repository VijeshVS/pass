export type ContactInfo = {
  name: string;
  phone: string;
};

export type EventCategory = 'Cultural' | 'Technical' | 'Innovative' | 'Gaming';
export type FeeType = 'individuals' | 'team';

export interface EventFormData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: EventCategory;
  prizes: string[];
  teamsize: string;
  registrationFee: number;
  feetype: FeeType;
  guidelines: string[];
  contact: ContactInfo[];
  registrationDeadline: string;
  registrationOpen: boolean;
  photoPath: string;
}

export const defaultEventData: EventFormData = {
  _id: '',
  name: '',
  slug: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  category: 'Cultural',
  prizes: [''],
  teamsize: '',
  registrationFee: 0,
  feetype: 'individuals',
  guidelines: [''],
  contact: [{ name: '', phone: '' }],
  registrationDeadline: '',
  registrationOpen: false,
  photoPath: ''
};