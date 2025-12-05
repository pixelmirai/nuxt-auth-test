import pool from '~/server/utils/db';
import {jwtConfig} from "~/server/utils/jwt.js";
import { defineEventHandler, readBody } from 'h3';
import {createUser} from '../utils/users.js';


export default defineEventHandler(async (event) => {
    const {username, email, password} = await readBody(event)
    console.log("in signup")
    const response = await createUser(username, email, password)
    return response
})