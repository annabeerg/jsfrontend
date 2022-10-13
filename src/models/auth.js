const baseURL = "https://jsramverk-editor-anbj21.azurewebsites.net";

const auth = {
    login: async function login(user) {
        const response = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
        });

        const result = await response.json();
        
        return result;
    },
    register: async function register(user) {
        const response = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
        });

        const result = await response.json();
        
        return result;
    }
};

export default auth;