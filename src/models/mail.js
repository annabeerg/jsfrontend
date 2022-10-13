const baseURL = "https://jsramverk-editor-anbj21.azurewebsites.net";

const mail = {
    mailer: async function mailer(code, title, name, mottagare) {
        await fetch(`${baseURL}/mail/${code}/${title}/${name}/${mottagare}`);
        return "Email sent!";
    }
};

export default mail;