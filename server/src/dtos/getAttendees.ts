import Attendee from "../models/Attendee";

export interface GetAttendeesDto {
	id: number;
	page: number;
}

export interface GetAllResponse {
	attendees: Attendee[];
	length: number;
}
