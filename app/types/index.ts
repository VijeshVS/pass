export interface Contact {
  name: string;
  phone: string;
}

export interface Participant {
  name: string;
  arrived: boolean;
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
  prizes?: string[];
  teamsize?: string;
  registrationFee: number;
  feetype?: "individuals" | "team";
  guidelines?: string[];
  contact?: Contact[];
  registrationDeadline?: string;
  registrationOpen: boolean;
}

export interface Pass {
  _id: string;
  orderId?: string;
  signature?: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  type: "pass" | "event";
  classId?: string;
  noOfParticipants: number;
  participantsData?: Participant[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventResponse {
  status: number;
  event: Event;
}

export interface EventPassesResponse {
  success: boolean;
  totalParticipants: number;
  passes: Pass[];
  teamsRegistered?:number;
  participantsEntered?:number;
  partiallyEntered?: number;
  teamEnteredFully?:number;
}