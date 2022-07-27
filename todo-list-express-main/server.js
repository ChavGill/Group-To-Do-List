 // Import express module - Allows the use of Express
const express = require('express')
// assign app function to express simplyfing it
const app = express()
//importing mongodb module
const MongoClient = require('mongodb').MongoClient
// set the port of our application to 2121
const PORT = 2121
// set our environment variable file and requiring it. This helps keeping the password of the database private.
require('dotenv').config()

// declare our database url and names
let db,
    // declaring our database password with an environment variable
    //This .env file will not be uploaded to github because it is in the .gitignore file
    dbConnectionStr = process.env.DB_STRING,
    // declaring our database name 
    dbName = 'todo'

    
// connect to our database using our environment variable
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    
        .then(client => { 
            //console to let user know connection to database was successful
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) 
    })

// Middlewares and other routes here... 
// set our view engine to ejs
app.set('view engine', 'ejs')
// set our express server to use public folder "public" for client-side files
app.use(express.static('public'))
// set our express server default to use the url encoded format
app.use(express.urlencoded({ extended: true }))
// set our express server to use our json parser
app.use(express.json())


// Read (GET)- Get something and await for a response
app.get('/',async (request, response)=>{
    // Get all the todos items from the database
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    
    // Render the index.ejs file with items and left
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //This is the long way to do it: Instead of async/await it uses a .then...
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})


//Create (Post) - Ask server to add a Todo item to Mongodb in the body with completed status set as false
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // console log when item has been added
        console.log('Todo Added')
       //refresh page to see new todo item - This is a new read request, not an update.
        response.redirect('/')
    })
    // catch error if something goes wrong
    .catch(error => console.error(error))
})

//Update (Put) - This section is where a task would be marked as complete, once completed by the user and updated in MongoDB
app.put('/markComplete', (request, response) => {
    //updating items status completed or not  
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //setting the completed status to true
        $set: {
            completed: true
          }
    },{
        //setting status to false 
        sort: {_id: -1}, //Sort by _id, making the element appear at the bottom.
        upsert: false  //Update and insert false. Don't want to have the same document twice in the db
    })
    .then(result => {
        // console log if item has be completed
        console.log('Marked Complete')
        // adding response to ejs 
        response.json('Marked Complete')
    })
    //catch error
    .catch(error => console.error(error))

})

//Update (Put) - Updates Mongodb to change status of Item to Uncomplete
app.put('/markUnComplete', (request, response) => {
    //updating items status completed or not  
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //setting the completed status to false
            completed: false
          }
    },{ 
        //setting status to false 
        sort: {_id: -1}, //Sort by _id, making the element appear at the bottom. I think this was badly copypasted and should be 1 to put it at the top. 
        upsert: false  //Update and insert false. Don't want to have the same document twice in the db
    })
    .then(result => {
        // console log if item has been completed
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    .catch(error => console.error(error))

})

//Deleté (Delete) - It selects an element and tells the db to drop it from the collection. 
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) 
    .then(result => {
        
        console.log('Todo Deleted')  //If everything went ok, it logs the message in the console
        //upating the page letting user know item was deleted
        response.json('Todo Deleted')  
    })
    //catch error
    .catch(error => console.error(error))

})

//This is where you can add a specific local host or be assigned one when uploaded to the hosting app(Heroku)
app.listen(process.env.PORT || PORT, ()=>{
    //loggin server errors
    console.log(`Server running on port ${PORT}`)
})
