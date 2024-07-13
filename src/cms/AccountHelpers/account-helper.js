import { account } from "../cms.config";

export const LoginUser = async(email,password) => {
    try {
        const result = await account.createEmailSession(email, password);
        // console.log(result);
        const currentUser = await account.get();
        return {
            success: true,
            data: currentUser
        }
    } catch (error) {
        console.log(error.message);
        return {
            success: false,
            message: error.message
        }
    }
}


