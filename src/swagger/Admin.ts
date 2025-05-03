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
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful for admin
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
