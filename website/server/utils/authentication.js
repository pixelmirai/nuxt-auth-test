import bcrypt, {hash} from "bcrypt";
import {v4} from 'uuid';
import pool from "./db.js";

async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds (recommended: 10-12)
    return await bcrypt.hash(password, saltRounds);
}


const login = async (user,options= {username,email,passowrd})=>{

    const {username, email,password} = options;

    if (!user?.uuid){
        throw new Error("invalid user")
    }

    if (!username && !email){
        throw new Error("username or email required");
    }
    if (!password){
        throw new Error("password required")
    }

    try {
        const hashedPassword = await hashPassword(password);
        if (user.passowrd !== hashedPassword){
            throw new Error("incorrect password")
        }





    } catch (e) {
        throw new Error(e.message)
    }





}