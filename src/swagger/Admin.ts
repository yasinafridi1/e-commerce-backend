/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin's email address
 *               password:
 *                 type: string
 *                 description: Admin's password
 *               fcmToken:
 *                 type: string
 *                 description: FCM token for push notifications (at least 4 characters)
 *             required:
 *               - email
 *               - password
 *               - fcmToken
 *     responses:
 *       200:
 *         description: Login successful for admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: The unique ID of the admin user
 *                 email:
 *                   type: string
 *                   description: Admin's email address
 *                 fullName:
 *                   type: string
 *                   description: Admin's full name
 *                 role:
 *                   type: string
 *                   description: The role of the admin user
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token for authentication
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token to refresh access token
 *                 profilePicture:
 *                   type: string
 *                   description: The URL of the admin's profile picture (optional)
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get the admin profile
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved the admin profile
 *   patch:
 *     summary: Update the admin profile
 *     tags: [Admin]

 *     responses:
 *       200:
 *         description: Successfully updated the admin profile
 */
