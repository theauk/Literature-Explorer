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
    });
});

describe("Test the path '/' in the server", () => {
    test("GET request should respond with HTML content", async () => {
        const response = await request(server)
            .get("/")
        expect(response.headers["content-type"]).toMatch(/text\/html/);
        expect(response.statusCode).toBe(200);
    });
});

describe("Test the path '/get-graph' in the server", () => {
    test("GET request should respond with content including nodes", async () => {
        const response = await request(server)
            .get("/get-graph")
        expect(response.text).toMatch(/"nodes"/);
        expect(response.statusCode).toBe(200);
    }, 10000);
});

describe("The '/getgraphbyID/paper-1' should only return edges starting from node 1", () => {
    test("GET request should respond with 200 status code", async () => {
        const response = await request(server)
            .get("/getgraphbyID/paper%201")
        expect(response.text).not.toMatch(/"from":"paper [2-9]"/)
        expect(response.statusCode).toBe(200);
    }, 10000);
});