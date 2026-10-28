'use strict';

const express = require('express');

function createServer() {
  const app = express();
  const users = [];
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

  return app;
}

module.exports = {
  createServer,
};
