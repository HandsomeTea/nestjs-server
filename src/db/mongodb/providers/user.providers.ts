import { Connection } from 'mongoose';
import { UserSchema } from '../schemas/user.schema';

export const UsersProvider = {
	provide: 'USER_MODEL',
	useFactory: (connection: Connection) => connection.model('user', UserSchema, 'user'),
	inject: ['DATABASE_CONNECTION']
};
