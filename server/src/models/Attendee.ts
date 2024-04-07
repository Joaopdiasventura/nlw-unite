export default interface Attendee {
	id: number;
	name: string;
	email: string;
	createdAt: Date;
	eventId: number;
	checkedInAt?: Date;
}
