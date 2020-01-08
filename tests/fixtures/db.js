const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/db/models/user')
const Task = require('../../src/db/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Venkat',
    email: 'venkat@test.com',
    password: 'myPass234!',
    tokens:[{
        token: jwt.sign({_id:userOneId}, process.env.JWT_SECRET_KEY)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Ramki',
    email: 'ramki@test.com',
    password: 'myPass234!',
    tokens:[{
        token: jwt.sign({_id:userTwoId}, process.env.JWT_SECRET_KEY)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    owner: userTwo._id
}

setupDatabase = async ()=> {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save() 
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
    
}