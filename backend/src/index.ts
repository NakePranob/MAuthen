import Fastify from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors';

import {signin, signup, confirmation, logout, test} from './route/sendCognito';

dotenv.config();

const server = Fastify({ logger: true });
server.register(cors, {
  origin: "*"
});

server.post('/signin', signin);
server.post('/signup', signup);
server.post('/confirmation', confirmation);

server.get('/logout', logout);

server.get('/test', test);

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