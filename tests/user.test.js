const request = require('supertest')
const app = require('../src/app')
const User = require('../src/db/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Ramki',
        email: 'vjasti@dxc.com',
        password: 'byPass88!'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

})

test('Login the existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})

test('Should not login a non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'test',
        password: 'test'
    }).expect(400)
})

test('Should get profile for authorized user', async () => {
    await request(app).get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
})

test('Should not get profile for unauthorized user', async () => {
    await request(app).get('/users/me')
            .send()
            .expect(401)
})

test('Should not delete profile for unauthorized user', async () => {
    await request(app).delete('/users/me')
            .send()
            .expect(401)
})

test('Should delete profile for authorized user', async () => {
    const response = await request(app).delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
    
    const usr = await User.findById(userOneId)
    //expect(usr).toBeNull()
})

test('Should upload avatar image', async () => {
    await request(app).post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar','tests/fixtures/profile-pic.jpg')
            .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app).patch('/users/me')
                    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                    .send({name: 'Ramakrishna'})
                    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Ramakrishna')

})

test('Should not update in-valid user fields', async () => {
    await request(app).patch('/users/me')
                    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                    .send({location: 'Hyderabad'})
                    .expect(400)
})


