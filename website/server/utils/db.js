import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'junction.proxy.rlwy.net',
    port: 39854,
    user: 'root',
    password: 'cfKzCoTAYuDqWVCGJbEoYcftIRVRTIZZ',
    database: 'railway',
});

export default pool;