export declare class CacheServer {
	setUserById(user: UserModel): Promise<void>;
	getUserById(userId: string): Promise<UserModel>;
}
