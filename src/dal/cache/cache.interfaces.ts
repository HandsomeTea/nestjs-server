export interface CacheServer {
	setUserById(user: UserModel): Promise<void>;
	getUserById(userId: string): Promise<UserModel>;
	deleteUserById(userId: string | Array<string>): Promise<void>;
}
