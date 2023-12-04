const supertest = require('supertest');
const chai = require('chai');
const app = require('../src/index');
const ioClient = require('socket.io-client');
const { expect } = chai;
const request = supertest(app);

describe('Test de Integración con Express y Handlebars', () => {
  it('Debería obtener una respuesta exitosa desde la ruta principal', async () => {
    const res = await request.get('/');
    expect(res.status).to.equal(200);
  });
//Prueba de eventos
/*it('Debería emitir y recibir el evento "chat:message" correctamente', (done) => {
  const client = ioClient.connect('http://localhost:4000');

  client.on('connect', () => {
    // ... (código omitido para brevedad)

    client.on('chat:message', (message) => {
      try {
        expect(message).to.equal('Hola desde el servidor');
        client.disconnect();
        // Asegúrate de llamar a done() después de todas las operaciones asíncronas
        done();
      } catch (error) {
        // Maneja cualquier error y llama a done con el error
        done(error);
      }
    });
  });
});*/

});
