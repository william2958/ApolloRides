import { ITrip } from '../trip/index';

export interface IUser {
	id: string
	first_name: string
	last_name: string
	auth_token: string
	first_time: boolean

	trips_driving: ITrip[]
	trips_requested: ITrip[]
	facebook_link: string
	phone_number: string
	past_trips_driven: ITrip[]
	past_trips_requested: ITrip[]

	first_time_driver: boolean
	license_plate: string
	car_model: string

}