const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
    try {
        const productos = await pool.query('SELECT * FROM producto');
        res.render('index', { productos: productos });
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
