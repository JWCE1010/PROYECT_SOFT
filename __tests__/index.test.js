const request = require('supertest');
const app = require('../src/index');
const { expect } = require('chai');
const io = require('socket.io-client');

describe('Server Status and Home Page', () => {
  it('should respond with status 200 on /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });

  it('should respond with status 200 and HTML content on /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .end(done);
  });
});
describe('Authentication', () => {
  it('should respond with status 200 on /logout', (done) => {
    request(app)
      .get('/logout')
      .expect(302)
      .end(done);
  });
});

describe('Prueba de eventos al WebSocket Service', function () {
  let socket;

  beforeEach(function (done) {
    socket = io.connect('http://localhost:4000', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket'],
    });

    socket.on('connect', function () {
      done();
    });

    socket.on('disconnect', function () {
    });
  });

  afterEach(function (done) {
    if (socket.connected) {
      socket.disconnect();
    }
    done();
  });

  it('should send and receive chat messages', function (done) {
    socket.emit('chat:message', 'Test Message');

    socket.on('chat:message', function (data) {
      expect(data).to.equal('Test Message');
      done();
    });
  });
});
