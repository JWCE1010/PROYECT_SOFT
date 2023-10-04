const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('producto/add');
});

router.post('/add', async (req, res) => {
    const { name, precio, description } = req.body;
    const newProduct = {
        name,
        precio,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO producto set ?', [newProduct]);
    req.flash('success', 'Product Saved Successfully');
    res.redirect('/producto');
});

router.get('/', isLoggedIn, async (req, res) => {
    const producto = await pool.query('SELECT * FROM producto WHERE user_id = ?', [req.user.id]);
    res.render('producto/list', { producto });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM producto WHERE ID = ?', [id]);
    req.flash('success', 'Product Removed Successfully');
    res.redirect('/producto');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const producto = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
    console.log(producto);
    res.render('producto/edit', {productos: producto[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, precio} = req.body; 
    const newProduct = {
        name,
        description,
        precio
    };
    await pool.query('UPDATE producto set ? WHERE id = ?', [newProduct, id]);
    req.flash('success', 'Product Updated Successfully');
    res.redirect('/producto');
});

module.exports = router;