type UserStatus = 'active' | 'lock'

interface UserModel {
    _id: string
    name: string
    phone?: { number: string, verify: boolean }
    email?: { address: string, verify: boolean }
    password?: { bcrypt: string, algorithm: 'sha-256' | 'sha-1', updateAt: Date, wrongTimes?: number, unLockAt?: Date }
    role: Array<'user'>
    avatar?: { url: string, updateAt: Date }
    status: UserStatus
    lastLogin?: Date
    firstLogin?: Date
    createdAt: Date
    updatedAt: Date
}

interface UserTokenModel {
    _id: string
    userId: string
    hashedToken: string
    createdAt: Date
    updatedAt: Date
}
