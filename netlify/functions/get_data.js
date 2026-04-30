const { Client } = require('pg');

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL, // Set this in Netlify Env Vars
        ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    try {
        const { role, userId } = JSON.parse(event.body);

        if (role === 'admin') {
            // Fetch everything for Admin
            const users = await client.query('SELECT * FROM users');
            const appointments = await client.query('SELECT * FROM appointments');
            return {
                statusCode: 200,
                body: JSON.stringify({ users: users.rows, appointments: appointments.rows })
            };
        } else {
            // Fetch only specific user data
            const records = await client.query('SELECT * FROM appointments WHERE user_id = $1', [userId]);
            return {
                statusCode: 200,
                body: JSON.stringify({ records: records.rows })
            };
        }
    } catch (err) {
        return { statusCode: 500, body: err.toString() };
    } finally {
        await client.end();
    }
};