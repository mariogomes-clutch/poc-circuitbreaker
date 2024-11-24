# Circuit Breaker Testing Guide

This guide shows how to test the circuit breaker functionality using predefined healthy and failing endpoints.

---

## How to Run the Tests

1. **Start the Application**
   ```bash
   npm run dev
   ```
   The app should be running at `http://localhost:3000`.

2. **Test Healthy Endpoint**
   ```bash
   curl "http://localhost:3000/api/testBreaker?endpoint=https://api.github.com/users/octocat/repos"
   ```
    - **Expected Behavior**: Returns a list of repositories.
    - **Circuit State**: `CLOSED` (normal operation).

   Example Output:
   ```json
   [
     {
       "id": 1296269,
       "name": "Hello-World",
       "full_name": "octocat/Hello-World"
     }
   ]
   ```

3. **Test Failing Endpoint**
   ```bash
   curl "http://localhost:3000/api/testBreaker?endpoint=https://api.invalid-url.com/fail"
   ```
    - **Expected Behavior**: After a few failures, the circuit transitions to `OPEN`, blocking requests.
    - **Circuit State**: `OPEN`.

   Example Output:
   ```json
   {
     "error": "Circuit breaker triggered or API failed."
   }
   ```

4. **Simulate Recovery**
    - Wait for `resetTimeout` (10 seconds by default).
    - Run the healthy endpoint test again:
      ```bash
      curl "http://localhost:3000/api/testBreaker?endpoint=https://api.github.com/users/octocat/repos"
      ```
    - **Expected Behavior**:
        - Circuit transitions to `HALF-OPEN` and sends a test request.
        - If the test succeeds, the circuit transitions to `CLOSED` and resumes normal operation.

---

## Circuit States and Behavior

| State       | When It Happens                  | Behavior                                                                 |
|-------------|----------------------------------|--------------------------------------------------------------------------|
| `CLOSED`    | Endpoint is healthy              | All requests are processed normally.                                     |
| `OPEN`      | Too many failures                | Requests are blocked immediately, and the fallback response is returned. |
| `HALF-OPEN` | After reset timeout              | Sends one test request to check if the endpoint has recovered.           |

---

## Configuration Notes

- Adjust circuit breaker settings in `src/utils/circuitBreaker.ts`:
    - **`timeout`**: Maximum wait time for a request.
    - **`errorThresholdPercentage`**: Failure percentage to trigger `OPEN`.
    - **`resetTimeout`**: Time to wait before checking if the endpoint is healthy.

---