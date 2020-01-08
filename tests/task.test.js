const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/db/models/task')
const {userOneId, 
        userOne,
        userTwoId,
        userTwo,
        taskOne,
        taskTwo,
        taskThree,
        setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create a Task', async () => {
    const response = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From My Test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should get tha tasks', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(2)
})

test('Should deny unauthorized to delete another user task', async () => {
    await request(app).delete(`/tasks/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})