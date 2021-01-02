// Add import statements
const {app, server, mongoose} = require('./../app')
const Article = require('./../article.model')
const request = require('supertest')

describe("When the article CRUD server is running", ()=>{
    // Add individual test cases
    
    it("should return 200 response if POST request receives proper article data", async ()=>{
        const res = await request(app).post('/article/new')
                                    .send({title: 'test', content: 'test'})
        expect(res.status).toBe(200)
        expect(typeof res.body).toEqual('object')
    })

    it("should return 400 response if POST request data is missing the article title", async ()=>{
        const res = await request(app).post('/article/new')
                                    .send({content: 'test'})
        expect(res.status).toBe(400)
        expect(typeof res.body).toEqual('object')
    })
 
    it("should return 200 response and all the articles in DB on GET request to '/article/all'", 
        async ()=>{
            const res = await request(app).get('/articles/all')
            expect(res.status).toBe(200)
            expect(res.body.length).toEqual(1)
        }
    )

    it("should return an article matching the ID specified in a GET request to '/article/:id'", 
        async () => {
            const allArticles = await request(app).get('/articles/all')
            const id = allArticles.body[0]._id
            console.log(id)
            const res = await request(app).get('/articles/'+id)
            expect(res.status).toBe(200)
            expect(res.body.title).toEqual('test')
        }
    )

    it("should return 400 status id an invalid ID is specified in a GET request to '/article/:id'", 
        async () => {
            const res = await request(app).get('/articles/sdfgdf')
            expect(res.status).toBe(400)
        }
    )

	afterAll(async () => {
        await server.close();
        await mongoose.connection.db.dropDatabase()
        await mongoose.connection.close()
     }
    )
})
