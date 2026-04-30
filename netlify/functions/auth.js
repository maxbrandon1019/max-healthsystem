const { Client } = require('pg');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    await client.connect();

    try {
        const body = JSON.parse(event.body);
        const { action, email, password, role } = body;

        if (action === 'register') {
            // 1. Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 2. Insert into Neon
            await client.query(
                'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
                [email, hashedPassword, role || 'user']
            );

            return { statusCode: 200, body: JSON.stringify({ message: "User created" }) };
        }
        
        // Login logic would go here next...
        
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ message: err.detail || err.message }) };
    } finally {
        await client.end();
    }
};