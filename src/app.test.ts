import request from 'supertest';
import app from './app';

describe('Testing metrics', () => {
  it('/time - should return 200 status OK and the current time in epoch', async () => {
    const result = await request(app).get('/time');

    const epochTime = Math.round(Date.now() / 1000);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ time: epochTime });
  });

  it('/metrics - should return 403 status if Authorization header is not correct', async () => {
    const result = await request(app)
      .get('/metrics')
      .set({ Authorization: 'Basic asdasdasdsad', 'Content-Type': 'application/json' });

    expect(result.status).toBe(403);
    expect(result.body).toEqual({ message: 'Not authorizated' });
  });

  it('/metrics - should return 200 status if Authorization header is correct', async () => {
    const result = await request(app)
      .get('/metrics')
      .set({ Authorization: 'Basic mysecrettoken', 'Content-Type': 'application/json' });
    console.log(result.text);

    expect(result.status).toBe(200);
  });

  it('/metrics - should return the update results from prometheus on second api call', async () => {
    const result = await request(app)
      .get('/metrics')
      .set({ Authorization: 'Basic mysecrettoken', 'Content-Type': 'application/json' });
    console.log(result.text);

    const firstCall = 'http_requests_total{route="/time",method="GET",status="2XX"} 1';

    expect(result.text).toMatch(firstCall);

    await request(app).get('/time');

    const result2 = await request(app)
      .get('/metrics')
      .set({ Authorization: 'Basic mysecrettoken', 'Content-Type': 'application/json' });

    const secondCall = 'http_requests_total{route="/time",method="GET",status="2XX"} 2';

    expect(result2.text).toMatch(secondCall);
  });
});
