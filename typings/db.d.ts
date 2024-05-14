type UserStatus = 'ACTIVE' | 'LOCKED'
type UserType = 'ADMIN' | 'USER'
type PasswordAlgorithm = 'sha-256' | 'sha-1'

interface UserModel {
    _id: string
    name: string
    phone?: { number: string, verify: boolean }
    email?: { address: string, verify: boolean }
    password?: { bcrypt: string, algorithm: PasswordAlgorithm, updateAt: Date, wrongTimes?: number, unLockAt?: Date }
    type: Array<UserType>
    role?: Array<string>
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

interface RoleModel {
    _id: string
    name: string
    permission: Record<string, Array<string>>
    type: 'INNER_ADMIN' | 'CUSTOMER'
    createdAt: Date
    updatedAt: Date
}
