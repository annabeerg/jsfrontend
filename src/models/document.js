const documents = {
    getDocuments: async function getDocuments(token) {
        try {
            const response = await fetch(`https://jsramverk-editor-anbj21.azurewebsites.net/documents`, {
                headers: {
                    "x-access-token": token,
                }
            });
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.log("error")
        }
    },
    addDocument: async function addDocument(title, message, token) {

        const value = {'name': title, 'content': message, "allowed_users":[{id: token}], comments: []}
        try {
            const response = await fetch(`https://jsramverk-editor-anbj21.azurewebsites.net/documents`, {
                body: JSON.stringify(value),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            });
            const result = await response.json();
            return result.data
        } catch (error) {
            console.log("Could not add document!")
        }
    },
    getDocument: async function getDocument(id, key) {
        try {
            const query = `
                _id
                name
                content
                allowed_users {
                    id
                }
                comments {
                    line
                    comment
                    content
                }
            `
            const response = await fetch('https://jsramverk-editor-anbj21.azurewebsites.net/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query: `{  document(id: "${id}") { ${query} }}` })
            })
                const result = await response.json();
                if (result.data.document.allowed_users.find(e => e.id === key)) {
                    return result.data.document;
                } else {
                    return "Access denied."
                }
        } catch (error) {
            console.log("Could not get document!")
        }
    },
    updateDocument: async function updateDocument(id, title, message) {
        try {
                await fetch(`https://jsramverk-editor-anbj21.azurewebsites.net/documents/update/${id}/${title}/${message}`);
                return "updated";
        } catch (error) {
            console.log("Could not update document!")
        }
    },
    addAllowed: async function addAllowed(id, code) {
        const key = code.code

        try {
            const response = await fetch(`https://jsramverk-editor-anbj21.azurewebsites.net/documents/add/${id}/${key}`);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.log("Could not update access!")
        }
    },
    addComment: async function addComment(id, line, comment, content) {

        try {
            const response = await fetch(`https://jsramverk-editor-anbj21.azurewebsites.net/documents/comment/${id}/${line}/${comment}/${content}`);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.log("Could not update access!")
        }
    }
};

export default documents;

