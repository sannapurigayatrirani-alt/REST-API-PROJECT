const express=require('express');
const path=require('path');
const {open}=require('sqlite');
const sqlite3=require('sqlite3');
const app=express();
app.use(express.json());
const dbPath=path.join(__dirname,'users.db');
let db=null;

const initializeDbAndServer=async()=>{
    try {
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        })

        await db.run(`
            CREATE TABLE IF NOT EXISTS users(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
            );
        `);
        
        app.listen(3001,()=>{
            console.log('server is running at http://localhost:3001/');
        })
    } catch(error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
}
initializeDbAndServer();

// GET all users with search and sort filters
app.get('/users',async(request,response)=>{
    const {search, sort, order = 'asc'} = request.query;

    let query = 'SELECT * FROM users';
    let params = [];
    let conditions = [];

    // Add search filter (searches in name and email)
    if (search) {
        conditions.push('(name LIKE ? OR email LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }

    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add sorting
    if (sort) {
        const validSortFields = ['name', 'email'];
        const validOrder = ['asc', 'desc'];

        if (validSortFields.includes(sort) && validOrder.includes(order.toLowerCase())) {
            query += ` ORDER BY ${sort} ${order.toUpperCase()}`;
        }
    }

    try {
        const users = await db.all(query, params);
        response.json(users);
    } catch (error) {
        console.error('GET /users error:', error);
        response.status(500).json({error: 'Internal server error'});
    }
})

// GET single user by ID
app.get('/users/:id',async(request,response)=>{
    const {id} = request.params;

    try {
        const user = await db.get('SELECT * FROM users WHERE id = ?',[id]);

        if (!user) {
            return response.status(404).json({error: 'User not found'});
        }

        response.json(user);
    } catch (error) {
        response.status(500).json({error: 'Internal server error'});
    }
})

// POST - Create new user
app.post('/users',async(request,response)=>{
    const {name,email} = request.body;

    // Basic validation
    if (!name || !email) {
        return response.status(400).json({error: 'Name and email are required'});
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return response.status(400).json({error: 'Invalid email format'});
    }

    try {
        const result = await db.run('INSERT INTO users(name,email) VALUES (?,?)',[name,email]);
        response.status(201).json({
            message: 'User created successfully',
            userId: result.lastID
        });
    } catch (error) {
        console.error('POST /users error:', error);
        if (error.message.includes('UNIQUE constraint failed')) {
            response.status(400).json({error: 'Email already exists'});
        } else {
            response.status(500).json({error: 'Internal server error'});
        }
    }
})

// PUT - Update user
app.put('/users/:id',async(request,response)=>{
    const {id} = request.params;
    const {name,email} = request.body;

    // Basic validation
    if (!name || !email) {
        return response.status(400).json({error: 'Name and email are required'});
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return response.status(400).json({error: 'Invalid email format'});
    }

    try {
        const result = await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?',[name,email,id]);

        if (result.changes === 0) {
            return response.status(404).json({error: 'User not found'});
        }

        response.json({message: 'User updated successfully'});
    } catch (error) {
        console.error('PUT /users/:id error:', error);
        if (error.message.includes('UNIQUE constraint failed')) {
            response.status(400).json({error: 'Email already exists'});
        } else {
            response.status(500).json({error: 'Internal server error'});
        }
    }
})

// DELETE user
app.delete('/users/:id',async(request,response)=>{
    const {id} = request.params;

    try {
        const result = await db.run('DELETE FROM users WHERE id = ?',[id]);

        if (result.changes === 0) {
            return response.status(404).json({error: 'User not found'});
        }

        response.json({message: 'User deleted successfully'});
    } catch (error) {
        console.error('DELETE /users/:id error:', error);
        response.status(500).json({error: 'Internal server error'});
    }
})
