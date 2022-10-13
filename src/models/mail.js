const baseURL = "https://jsramverk-editor-anbj21.azurewebsites.net";

const mail = {
    mailer: async function mailer(code, title, name, mottagare) {
        const result = await fetch(`${baseURL}/mail/${code}/${title}/${name}/${mottagare}`);
        console.log(result)
        return "Email sent!";
    }
};

export default mail;