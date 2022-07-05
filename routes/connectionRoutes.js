const express = require('express');
const { validationResult } = require('express-validator');
const controller = require('../controllers/connectionController');
const {authenticate, isAuthor} = require('../middlewares/auth');
const {validateId, validateConnection, validateResult} = require('../middlewares/validator');

const router = express.Router();

//GET /connections: send all connections to the user
router.get('/', controller.index);

//GET /connections/new: send html form for creating a new connection
router.get('/new', authenticate, controller.new);

//POST /connections: create a new connection
router.post('/', authenticate, validateConnection, validateResult, controller.create);

//GET /connections/:id: send details of story identified by id
router.get('/:id', validateId, controller.show);

//GET /connections/:id/edit: send html form for editing an existing connection
router.get('/:id/edit', validateId, authenticate, isAuthor, controller.edit);

//PUT /connections/:id: update the connection identified by id
router.put('/:id', validateId, authenticate, isAuthor, validateConnection, validateResult, controller.update);

//DELETE /connections/:id, delete the connection identidied by id
router.delete('/:id', validateId, authenticate, isAuthor, controller.delete);

router.post('/:id/rsvp', validateId, authenticate, controller.editRsvp);

router.delete('/:id/rsvp', validateId, authenticate, controller.deleteRsvp)

module.exports = router;