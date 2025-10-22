import axios from "axios";

const API_URL = 'https://api.example.com/users';

export async function fetchUser(userId: string) {
    try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;       
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}