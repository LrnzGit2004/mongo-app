const Todo = require("../models/Todo");

// Récupérer tous les todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau todo
exports.createTodo = async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      completed: req.body.completed,
    });

    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer un todo spécifique
exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo non trouvé" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un todo
exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo non trouvé" });

    if (req.body.title) todo.title = req.body.title;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo non trouvé" });

    await todo.deleteOne();
    res.json({ message: "Todo supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
