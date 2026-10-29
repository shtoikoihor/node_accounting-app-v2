'use strict';

const express = require('express');

function createServer() {
  const app = express();
  const users = [];
  const expenses = [];
  let nextExpenseId = 1;
  let nextId = 1;

  app.use(express.json());

  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  app.get('/users', (req, res) => {
    res.json(users);
  });

  app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const foundUser = users.find((user) => user.id === id);

    if (!foundUser) {
      res.sendStatus(404);

      return;
    }

    res.json(foundUser);
  });

  app.post('/users', (req, res) => {
    if (!req.body.name) {
      res.sendStatus(400);

      return;
    }

    const user = {
      id: nextId,
      name: req.body.name,
    };

    users.push(user);
    nextId++;

    res.status(201).json(user);
  });

  app.patch('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const foundUser = users.find((user) => user.id === id);

    if (!foundUser) {
      res.sendStatus(404);

      return;
    }

    if (!req.body.name) {
      res.sendStatus(400);

      return;
    }

    foundUser.name = req.body.name;

    res.json(foundUser);
  });

  app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      res.sendStatus(404);

      return;
    }

    users.splice(index, 1);

    res.sendStatus(204);
  });

  app.post('/expenses', (req, res) => {
    const foundUser = users.find((user) => user.id === req.body.userId);

    if (
      !req.body.userId ||
      !req.body.spentAt ||
      !req.body.title ||
      !req.body.amount ||
      !req.body.category
    ) {
      res.status(400).json({});

      return;
    }

    if (!foundUser) {
      res.sendStatus(400);

      return;
    }

    const expense = {
      id: nextExpenseId,
      userId: req.body.userId,
      spentAt: req.body.spentAt,
      title: req.body.title,
      amount: req.body.amount,
      category: req.body.category,
      note: req.body.note,
    };

    expenses.push(expense);
    nextExpenseId++;
    res.status(201).json(expense);
  });

  app.get('/expenses', (req, res) => {
    let result = expenses;

    if (req.query.userId) {
      const userId = Number(req.query.userId);

      result = result.filter((expense) => expense.userId === userId);
    }

    if (req.query.categories) {
      const categories = Array.isArray(req.query.categories)
        ? req.query.categories
        : [req.query.categories];

      result = result.filter((expense) =>
        categories.includes(expense.category),
      );
    }

    if (req.query.from) {
      const from = new Date(req.query.from);

      result = result.filter((expense) => new Date(expense.spentAt) >= from);
    }

    if (req.query.to) {
      const to = new Date(req.query.to);

      result = result.filter((expense) => new Date(expense.spentAt) <= to);
    }

    res.json(result);
  });

  app.get('/expenses/:id', (req, res) => {
    const id = Number(req.params.id);
    const foundExpense = expenses.find((expense) => expense.id === id);

    if (!foundExpense) {
      res.sendStatus(404);

      return;
    }

    res.json(foundExpense);
  });

  app.delete('/expenses/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = expenses.findIndex((expense) => expense.id === id);

    if (index === -1) {
      res.sendStatus(404);

      return;
    }

    expenses.splice(index, 1);

    res.sendStatus(204);
  });

  app.patch('/expenses/:id', (req, res) => {
    const id = Number(req.params.id);
    const foundExpense = expenses.find((expense) => expense.id === id);

    if (!foundExpense) {
      res.sendStatus(404);

      return;
    }

    if (req.body.spentAt !== undefined) {
      foundExpense.spentAt = req.body.spentAt;
    }

    if (req.body.title !== undefined) {
      foundExpense.title = req.body.title;
    }

    if (req.body.amount !== undefined) {
      foundExpense.amount = req.body.amount;
    }

    if (req.body.category !== undefined) {
      foundExpense.category = req.body.category;
    }

    if (req.body.note !== undefined) {
      foundExpense.note = req.body.note;
    }

    res.json(foundExpense);
  });

  return app;
}

module.exports = {
  createServer,
};
