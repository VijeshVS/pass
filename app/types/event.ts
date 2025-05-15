export interface Contact {
  name: string;
  phone: string;
}

export interface Event {
  _id: string;
  photoPath?: string;
  slug: string;
  name: string;
  description?: string;
  date?: string;
  time?: string;
  venue?: string;
  category?: "Cultural" | "Technical" | "Innovative" | "Gaming";
  prizes: string[];
  teamsize?: string;
  registrationFee: number;
  feetype: "individuals" | "team";
  guidelines: string[];
  contact: Contact[];
  registrationDeadline?: string;
  registrationOpen: boolean;
  createdAt?: string;
  updatedAt?: string;
}