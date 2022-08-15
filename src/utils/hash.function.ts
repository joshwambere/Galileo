import {hash, compare} from "bcrypt";

const hashPassword = async(password: string) => {
    return await hash(password, 10);
}

const verifyOtp = async(otp: string, vCode:string) => {
    console.log(otp)
    console.log(vCode)
    return await compare(otp, vCode);
}

export {hashPassword,verifyOtp};
