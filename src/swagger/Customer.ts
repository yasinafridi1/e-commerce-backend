/**
 * @swagger
 * /customer/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the customer (min 3, max 50 characters)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer's email address
 *               password:
 *                 type: string
 *                 description: Customer's password
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number starting with '+' and only digits (length > 6 and < 16)
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 description: Gender of the customer
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - phoneNumber
 *               - gender
 *     responses:
 *       200:
 *         description: Customer register successfully
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               success:
 *                type: boolean
 *                example: true
 *               message:
 *                type: string
 *                example: User account created successfully
 *       422:
 *         description: Validation error
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               success:
 *                type: boolean
 *                example: false
 *               message:
 *                type: string
 *                example: Full name must be atleast 3 character
 *       500:
 *         description: Server Error
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               success:
 *                type: boolean
 *                example: false
 *               message:
 *                type: string
 *                example: Internal server error
 */
