import bcrypt from "bcrypt"

export const hashPassword = (rawPassword: string): Promise<string> => {
    return bcrypt.hash(rawPassword, 10)
}


export const verifyPassword = (rawPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(rawPassword, hashedPassword)
}




