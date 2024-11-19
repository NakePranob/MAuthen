import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors'

dotenv.config();

const server = Fastify({ logger: true });
server.register(cors, { 
    // put your options here
})


server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: 'Hello, Fastify with TypeScript and Yarn!' };
});

server.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const {email, password} = request.body as {email: string, password: string};
    console.log('email', email)
    console.log('password', password)
    reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
          message: "OTP sent to your email. Please verify."
       });
});

const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await server.listen({ port: +port });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
