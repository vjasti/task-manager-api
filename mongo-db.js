//CRUD create read update delete
const {MongoClient, ObjectID} =  require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error) {
        return console.log('Error: unable to connect to Database')
    }

    const db = client.db(databaseName)
    // db.collection('users').insertOne({
    //     name: 'Ramakrishna',
    //     company: 'DXC'
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description:'complet Node.js training',
    //         status: false
    //     },
    //     {
    //         description: 'create ASD for IPS DevSecOps project',
    //         status: true
    //     },
    //     {
    //         description: 'complete ELK solution for eChasis',
    //         status: false
    //     }
    // ], (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert documents')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection("tasks").findOne({_id: new ObjectID("5d8c6081a33f7b11c49353d5")}, (error, task) => {
    //     console.log(task)
    // })
    // db.collection("tasks").find({status: false}).toArray( (error, tasks) => {
    //     console.log(tasks)
    // })

    // db.collection('tasks').updateMany(
    //     {
    //         status: false
    //     },
    //     {
    //         $set:
    //         {
    //             status: true
    //         }
    //     }
    // ).then((result) => {
    //     console.log('Result', result)
    // }).catch((error) => {
    //     console.log('Error',error)
    // })
    db.collection('tasks').deleteMany(
        {
            status: true
        }
    ).then((result) =>{
        console.log('Result', result)
    })
})
