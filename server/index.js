import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    sendPasswordResetEmail,
    generateResetToken,
    verifyResetToken,
    invalidateToken,
} from './utils/emailService.js';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to read users from localStorage file (mock DB)
const getUsersDataPath = () => {
    return path.join(__dirname, '../localStorage_users.json');
};

const getUsers = () => {
    try {
        const data = readFileSync(getUsersDataPath(), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log('No users file found, returning empty array');
        return [];
    }
};

const saveUsers = (users) => {
    writeFileSync(getUsersDataPath(), JSON.stringify(users, null, 2));
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
    });
});

// POST /api/signup
// Save new user to database
app.post('/api/signup', (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }

    try {
        const users = getUsers();

        // Check if email already exists
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists',
            });
        }

        // Create new user
        const newUser = {
            id: `u${Date.now()}`,
            name,
            email,
            password,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            bio: role === 'student' ? 'Passionate learner exploring AI and technology' : 'Dedicated to making complex topics accessible',
            xp: 0,
            streak: 0,
            enrolledCourseIds: [],
            completedLessonIds: [],
            achievements: [],
            notes: [],
            certificates: [],
            subscriptionStatus: 'active',
        };

        users.push(newUser);
        saveUsers(users);

        console.log('✅ New user added to database:', email);

        res.json({
            success: true,
            message: 'User created successfully',
            user: { ...newUser, password: undefined }, // Don't send password back
        });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during signup',
        });
    }
});

// POST /api/login
// Verify user credentials
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required',
        });
    }

    try {
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        console.log(`✅ User logged in: ${email}`);

        res.json({
            success: true,
            message: 'Login successful',
            user: { ...user, password: undefined }, // Don't send password back
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during login',
        });
    }
});

// POST /api/auth/google
// Verify Google ID token and login/signup user
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token is required',
        });
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
        const { mode } = req.body; // Extract mode from request

        const users = getUsers();
        let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            if (mode === 'login') {
                return res.status(404).json({
                    success: false,
                    message: 'Account not found. Please sign up first.',
                });
            }

            // Create new user if not exists AND mode is 'signup'
            user = {
                id: `u${Date.now()}`,
                name,
                email,
                password: '', // No password for Google users
                role: 'student', // Default role
                avatar: picture,
                bio: 'Passionate learner exploring AI and technology',
                xp: 0,
                streak: 0,
                enrolledCourseIds: [],
                completedLessonIds: [],
                achievements: [],
                notes: [],
                certificates: [],
                subscriptionStatus: 'active',
                authProvider: 'google',
            };
            users.push(user);
            saveUsers(users);
            console.log(`✅ New Google user created: ${email}`);
        } else {
            console.log(`✅ Google user logged in: ${email}`);
        }

        res.json({
            success: true,
            message: 'Google login successful',
            user: { ...user, password: undefined },
        });
    } catch (error) {
        console.error('Error in Google auth:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid Google token',
        });
    }
});

// POST /api/forgot-password
// Send password reset email
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required',
        });
    }

    try {
        // Check if user exists in mock DB
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            // Return error - email not found in database
            console.log(`❌ Password reset failed - email not found: ${email}`);
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address. Please sign up first.',
            });
        }

        // Generate reset token
        const resetToken = generateResetToken(email);

        // Send email ONLY if user exists
        const emailSent = await sendPasswordResetEmail(email, resetToken);

        if (emailSent) {
            console.log(`✅ Password reset email sent to: ${email}`);
            res.json({
                success: true,
                message: 'Password reset email sent successfully. Please check your inbox.',
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send reset email. Please try again later.',
            });
        }
    } catch (error) {
        console.error('Error in forgot-password:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again.',
        });
    }
});

// GET /api/verify-token/:token
// Verify if a reset token is valid
app.get('/api/verify-token/:token', (req, res) => {
    const { token } = req.params;

    const tokenData = verifyResetToken(token);

    if (tokenData) {
        res.json({
            valid: true,
            email: tokenData.email,
        });
    } else {
        res.json({
            valid: false,
            message: 'Invalid or expired reset token',
        });
    }
});

// POST /api/reset-password
// Reset user's password
app.post('/api/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Token and new password are required',
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long',
        });
    }

    try {
        // Verify token
        const tokenData = verifyResetToken(token);

        if (!tokenData) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token',
            });
        }

        // Update password in mock DB
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email.toLowerCase() === tokenData.email.toLowerCase());

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        users[userIndex].password = newPassword;
        saveUsers(users);

        // Invalidate the token
        invalidateToken(token);

        console.log(`✅ Password reset successfully for: ${tokenData.email}`);

        res.json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.',
        });
    } catch (error) {
        console.error('Error in reset-password:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again.',
        });
    }
});

// PUT /api/users/:id
// Update user profile
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio, avatar } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required',
        });
    }

    try {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update allowed fields
        if (name) users[userIndex].name = name;
        if (bio) users[userIndex].bio = bio;
        if (avatar) users[userIndex].avatar = avatar;

        saveUsers(users);

        console.log(`✅ User updated: ${users[userIndex].email}`);

        res.json({
            success: true,
            message: 'User updated successfully',
            user: { ...users[userIndex], password: undefined },
        });
    } catch (error) {
        console.error('Error in update user:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating user',
        });
    }
});

// DELETE /api/users/:id
// Delete user account
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required',
        });
    }

    try {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const deletedEmail = users[userIndex].email;

        // Remove user from array
        users.splice(userIndex, 1);
        saveUsers(users);

        console.log(`✅ User deleted: ${deletedEmail}`);

        res.json({
            success: true,
            message: 'Account deleted successfully',
        });
    } catch (error) {
        console.error('Error in delete user:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting user',
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📧 Email service configured`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
