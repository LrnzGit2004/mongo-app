const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoControllers');

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.get('/:id', todoController.getTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;