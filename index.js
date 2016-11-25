let server = require('./backend/lib/server').server
const PORT = process.env.PORT||8000


try {
	server.listen(PORT);
	console.log('Server running on port ', PORT);
	console.log(`Acesso o quiz em : http://localhost:${PORT}/index.html`);
} catch(e) {
	console.log(e);
}