import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose';


//SAMPLE DATA TO TEST END POINTS CONTROLLERS 
const mockUser = {
    username: 'Harkirat',
    password:"123456",
    role:"admin"
};

const mockUser1 = {
username: 'Harkirat',
password:"123456",
role:"admin"
};

const product1={
name:"timex 123",
price:5000,
category:"watch",
stock:99,
description:"timex watch"
}

const product2={
    name:"gshock 123",
    price:5000,
    category:"watch",
    stock:99,
    description:"gshock watch"
}


//TOKENS AND MONGODB TEST_URI AND PRODUCTID IS PASSED TO TEST TO TEST END POINTS 
const testURI = process.env.TEST_URI;
const token = process.env.TOKEN
const productId ="66daf4a28feb1fb8462883c3"

if (!testURI) {
    console.error('MongoDB connection string is not defined in the environment variables.');
    process.exit(1); // Exit the process if the connection string is not defined
}

beforeAll(async () => {
// Close any existing connections before starting tests
if (mongoose.connection.readyState) {
    await mongoose.disconnect();
}

// Connect to the test database
await mongoose.connect(testURI);
});


afterAll(async () => {
await mongoose.disconnect();
});


//TESTING USER ROUTES 
describe("testing Routes of user",()=>{
    describe("POST /api/auth", () => {
        
        it('testing register api  /api/auth/register', async () => {
          const response = (await request(app).post("/api/auth/register").send(mockUser));
          expect(response.status).toBe(200);
        });
    
        it('testing login api  /api/auth/login', async () => {
            const response = (await request(app).post("/api/auth/login").send(mockUser1));
            expect(response.status).toBe(200);
          });
      });
      
})

//TESTING PRODUCT ROUTES 
describe("testing Routes of Products",()=>{

    //GET REQUESTS
    describe("GET /api/products", () => {

        //testing GET ALL PRODUCTS api and controller whether it's working correctly 
        it('testing getAllProducts api  /api/products', async () => {
          const response = (await request(app).get("/api/products").set('Authorization', `Bearer ${token}`));
          expect(response.status).toBe(200);
        });
    
        //testing GET STATS OF PRODUCTS api and controller whether it's working correctly 
        it('testing statsOfProduct api  /api/products/stats', async () => {
          const response = (await request(app).get("/api/products/stats").set('Authorization', `Bearer ${token}`));
          expect(response.status).toBe(200);
        });

        //testing GET PRODUCT BY ID api and controller whether it's working correctly
        it('testing statsOfProduct api  /api/products/:id', async () => {
            const response = (await request(app).get(`/api/products/${productId}`).set('Authorization', `Bearer ${token}`));
            expect(response.status).toBe(200);
          });
      });

    //POST REQUESTS
    describe('POST /api/products', () => { 
        
        //testing PRODUCT CREATION api and controller whether it's working correctly 
        it('testing createProduct api  /api/products', async () => {
        const response = (await request(app).post("/api/products").send(product1).set('Authorization', `Bearer ${token}`));
        console.log(response.body)
        expect(response.status).toBe(200);
        });      
    })

    //PUT REQUESTS
    describe('PUT /api/products', () => { 
        
        //testing UPDATE PRODUCT api and controller whether it's working correctly 
        it('testing updateProduct api  /api/products/:id ', async () => {
        const response = (await request(app).put(`/api/products/${productId}`).send(product2).set('Authorization', `Bearer ${token}`));
        console.log(response.body)
        expect(response.status).toBe(200);
        });      
    });

     //DELETE REQUESTS
     describe('PUT /api/products', () => { 
        
        //testing DELETE PRODUCT api and controller whether it's working correctly 
        it('testing updateProduct api  /api/products/:id ', async () => {
        const response = (await request(app).delete(`/api/products/${productId}`).set('Authorization', `Bearer ${token}`));
        console.log(response.body)
        expect(response.status).toBe(200);
        });      
    })
      
})