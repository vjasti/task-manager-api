const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../db/models/task')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})

//GET /tasks?completed=true/false
//GET /tasks?limit=10&skip=10
//GET /tasks?sortBy=createdAt:asc/desc
router.get('/tasks', auth, async (req,res) => {
    const match = {}
    const sort= {}
    if(req.query.completed) {
        match.completed = req.query.completed.toLowerCase() === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'?1:-1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task) {
            return res.status(404).send({error: 'Task Not Found'})
        }
        res.send(task)

    } catch(error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isAllowed = updates.every((update) => allowedUpdates.includes(update))

    if(!isAllowed) {
        return res.status(400).send({error: 'Invalid Update'})
    }
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send({error: 'Task not Found'})
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send({error: 'Task not found'})
        }
        res.send(task)
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router