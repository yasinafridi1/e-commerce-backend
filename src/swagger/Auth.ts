/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token/user session
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: User refresh token
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Session refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: User new access token
 *                     refreshToken:
 *                       type: string
 *                       description: User new refresh token
 *                     userData:
 *                      type: object
 *                      properties:
 *                       userId:
 *                        type: integer
 *                        description: User ID
 *                       role:
 *                        type: string
 *                        description: User role
 *                       fullName:
 *                        type: string
 *                        description: User full name
 *                       email:
 *                        type: string
 *                        description: User email
 *                      profilePicture:
 *                       type: string
 *                       description: User profile picture URL
 *
 *       422:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                      invalidToken:
 *                         value: Invalid Token
 *                      expiredToken:
 *                         value: Token Expired
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *
 */
