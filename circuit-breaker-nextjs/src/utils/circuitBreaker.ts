import CircuitBreaker from "opossum";
import axios from "axios";

// Function to simulate API behavior
const fetchData = async (endpoint: string): Promise<any> => {
    console.log(`Fetching data from: ${endpoint}`);
    const response = await axios.get(endpoint);
    return response.data;
};

// Circuit breaker configuration
const options = {
    timeout: 3000, // Timeout after 3 seconds
    errorThresholdPercentage: 50, // Open circuit if 50% of requests fail
    resetTimeout: 50000, // Wait 5 seconds before attempting to close the circuit
};

// Create the circuit breaker instance
const breaker = new CircuitBreaker(fetchData, options);

// Fallback function to execute when circuit is open
breaker.fallback(() => {
    console.log("Fallback triggered!");
    return { message: "Fallback response due to API failure." };
});

// Monitor circuit breaker events
breaker.on("open", () => console.log("Circuit is OPEN! Requests are blocked."));
breaker.on("halfOpen", () => console.log("Circuit is HALF-OPEN. Testing the service."));
breaker.on("close", () => console.log("Circuit is CLOSED. Service is healthy again."));
breaker.on("failure", (err) => console.log("Request failed:", err.message));

export const fetchWithCircuitBreaker = (endpoint: string) => breaker.fire(endpoint);
