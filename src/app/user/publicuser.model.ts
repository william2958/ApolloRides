import { ITrip } from '../trip/index';

export interface IPublicUser {
	id: string
	first_name: string
	last_name: string
	trips_driving: ITrip[]
	trips_requested: ITrip[]
	facebook_link: string
	phone_number: string
	past_trips_driven: ITrip[]
	past_trips_requested: ITrip[]
}