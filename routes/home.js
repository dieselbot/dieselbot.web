async function homeRoute(request, reply) {
    return reply.sendFile('index.html');
}

module.exports = homeRoute