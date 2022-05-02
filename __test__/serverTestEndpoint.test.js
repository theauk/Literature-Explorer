import 'regenerator-runtime/runtime';
const request = require('supertest');
const { server }  = require('../src/server/server');

// For closing the server after testing
afterAll(async () => {
    server.close();
});

describe("Test the path '/test' in the server", () => {
    test("GET request should respond with 'working'", async () => {
        const response = await request(server)
            .get("/test")
            .set('Accept', 'application/json');
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("working");
        console.log(response.headers);
    });
});