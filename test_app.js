// Import the necessary modules for testing
const request = require('supertest');
const app = require('./app');

// Create a test suite for the /api/tasks route
describe('/api/tasks', () => {
  // Create a test case to check if the route is being used correctly
  it('should use the /api/tasks route', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Tasks API' });
  });
});

// Use the /api/tasks route
app.use('/api/tasks', taskRoutes);