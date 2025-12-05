import {defineEventHandler, readBody} from "h3";
import {createUser} from "~/server/utils/users.js";

export default defineEventHandler(async (event) => {
    const {username, email, password} = await readBody(event)
    console.log("in signup")
    const response = await createUser(username, email, password)
    return response
})