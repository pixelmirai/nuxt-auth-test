import bcrypt from "bcrypt";
import {v4} from 'uuid';
import pool from "./db.js";
import {use} from "bcrypt/promises.js";
import {ca} from "date-fns/locale";


const createUser = async (username, email, password) => {
    try {

        const duplicates = await pool.execute(`
        SELECT * FROM users
        WHERE username = ? OR email = ?
        `, [username, email]);

        if (duplicates[0].length > 0) {
            console.log(`duplicates ${JSON.stringify(duplicates[0])}`)
            throw new Error("duplicates");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const uuid = v4();

        const sql = `
            INSERT INTO users (
                uuid, username, email, password, role, status, account_locked, login_attempts, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, 'user', 'active', 0, 0, NOW(), NOW());
        `;

        const [result] = await pool.execute(sql, [uuid, username, email, hashedPassword]);

        const fetchSql = `
            SELECT id, uuid, username, email, role, status, created_at
            FROM users
            WHERE uuid = ?;
        `;

        const [userRows] = await pool.execute(fetchSql, [uuid]);

        if (userRows.length === 0) {
            throw new Error("User creation failed, no user found with the generated UUID.");
        }

        return userRows[0];
    } catch (error) {
        console.error("Error creating user:", error.message);
        throw new Error("Failed to create user");
    }
}

const getUser = async (param) => {
    if (!param || typeof param !== 'string') {
        throw new Error("Incorrect param: Expected a non-empty string");
    }

    try {
        const response = await pool.execute(`
        SELECT * FROM users
        WHERE username = ? OR email = ? 
        `, [param, param])

        return response[0];


    } catch (e) {
        throw new Error(e.message)
    }

};

const getAllUsers = async (param) => {
    try {
        const response = await pool.execute(`
        SELECT * FROM users
        `)
        return response[0];

    } catch (e) {
        throw new Error(e.message)
    }
}

const updateUser = async (uuid, options = {username, email, password}) => {

    if (!uuid || typeof uuid !== 'string') {
        throw new Error("invalid uuid")
    }

    if (object.values(options).length !== 1) {
        throw new Error("exactly one option must be selected")
    }

    const {username, email, passowrd} = options;

    if (username) {
        try {
            const response = await pool.execute(`
            UPDATE users
            SET username = ?
            WHERE uuid = ?
        `, [username, uuid]);
            return response[0]
        } catch (e) {
            throw new Error(e.message);
        }
    } else if (email) {
        try {
            const response = await pool.execute(`
            UPDATE users
            SET email = ?
            WHERE uuid = ?
        `, [email, uuid]);
            return response[0]
        } catch (e) {
            throw new Error(e.message);
        }
    } else if (hashedPassword) {
        try {

            const response = await pool.execute(`
            UPDATE users
            SET password = ?
            WHERE uuid = ?
        `, [hashedPassword, uuid]);
            return response[0]
        } catch (e) {
            throw new Error(e.message);
        }
    } else {
        throw new Error('No valid fields provided for update');
    }

}


const deleteUser = async (uuid) => {
    if (!uuid) {
        throw new Error("invalid uuid")
    }

    try {
        const response = await pool.exectue(`
        DELETE FROM users
        WHERE uuid = ?
        `, [uuid])
        return response[0]
    } catch (e) {
        throw new Error(e.message)
    }


}


export {
    createUser, getUser, getAllUsers, updateUser,
    deleteUser

}


