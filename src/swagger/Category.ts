/**
 * @swagger
 * /category:
 *   post:
 *     summary: Add new Category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Category name here
 *             required:
 *               - title
 *     responses:
 *       200:
 *         description: Category added successfully
 *   get:
 *     summary: Get all category
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 */

/**
 * @swagger
 * /category/{categoryId}:
 *   get:
 *     summary: Get category detail
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to retrieve
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *   patch:
 *     summary: Update Category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to update
 *     responses:
 *       200:
 *         description: Category updated successfully
 *   delete:
 *     summary: Delete Category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
