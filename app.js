const http = require('http')
const express = require('express')

const app = express()
const server = http.Server(app)
const Article = require('./article.model')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

let dbURL = 'mongodb://localhost:27017/' + 
                        (process.env.NODE_ENV === 'test'? 'testDB' : 'realDB')
dbURL = process.env.NODE_ENV === 'prod' ? process.env.db : dbURL

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', function(err){
 console.log(err)
})

app.post('/article/new', function(request, response){
    var newArticle = new Article(request.body)
    newArticle.save(function(err, data){
      if(err)
        return response.status(400).json({error: 'Could not save article'})
      return response.status(200).json({message:'Article created successfully'})
    })
})

app.get('/articles/all', function(request, response){
    Article.find({}, function(err, data){
      response.status(200).json(data)
    })
})
   
app.get('/articles/:id', function(request, response){
    let id = request.params.id
    Article.findById(id, function(err, data){
        if(err){
            //return response.status(400).json({error: 'Article not found'})
        }
        return response.status(200).json(data)
    })
})   


server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0',
()=> {
 console.log('Server running')
}
      )


module.exports = {app, server, mongoose}

