import { IPublicUser } from '../../user/publicuser.model';

export interface ITrip {
	id: string
	driver: IPublicUser
	date: Date
	spaces: number
	price: number
	user_requests: IPublicUser[]
	accepted_users: IPublicUser[]

	location: {
		from: {
			from_country: string
			from_state: string
			from_city: string
			from_metadata: string
			pickup_location?: string
		}
		destination: {
			to_country: string
			to_state: string
			to_city: string
			to_metadata: string
			dropoff_location?: string
		}
	}

}