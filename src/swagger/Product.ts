/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Name of the product
 *               categoryId:
 *                 type: integer
 *                 description: ID of the category this product belongs to
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the product
 *               productType:
 *                 type: string
 *                 enum: [MALE, FEMALE,CHILDREN]
 *                 description: Type of the product
 *               status:
 *                 type: string
 *                 enum: [SHOW, HIDE]
 *                 description: Visibility status of the product
 *               variants:
 *                 type: string
 *                 description: >
 *                   JSON string representing the color and size variants of the product. Example:
 *                   ```
 *                   [
 *                     {
 *                       "color": "red",
 *                       "hex": "#FF0000",
 *                       "sizes": [
 *                         { "size": "xsm", "stock": 3 },
 *                         { "size": "sm", "stock": 5 }
 *                       ]
 *                     },
 *                     {
 *                       "color": "yellow",
 *                       "hex": "#FFFF00",
 *                       "sizes": [
 *                         { "size": "xsm", "stock": 3 },
 *                         { "size": "sm", "stock": 8 }
 *                       ]
 *                     }
 *                   ]
 *                   ```
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: One image per size per color (order must match variants)
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
