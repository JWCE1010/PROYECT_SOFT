const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('proveedor/add');
});

router.post('/add', async (req, res) => {
    const { Nombre, Apellido, Empresa, Direccion } = req.body;
    const newProveedor = {
        Nombre,
        Apellido,
        Empresa,
        Direccion,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO proveedor set ?', [newProveedor]);
    req.flash('success', 'proveedor Saved Successfully');
    res.redirect('/proveedor');
});

router.get('/', isLoggedIn, async (req, res) => {
    const proveedor = await pool.query('SELECT * FROM proveedor WHERE user_id = ?', [req.user.id]);
    res.render('proveedor/list', { proveedor });
});

router.get('/delete/:id_pro', async (req, res) => {
    const { id_pro } = req.params;
    await pool.query('DELETE FROM proveedor WHERE id_pro = ?', [id_pro]);
    req.flash('success', 'proveedor Removed Successfully');
    res.redirect('/proveedor');
});
router.get('/edit/:id_pro', async (req, res) => {
    const { id_pro } = req.params;
    const proveedor = await pool.query('SELECT * FROM proveedor WHERE id_pro = ?', [id_pro]);
    console.log(proveedor);
    res.render('proveedor/edit', { proveedores: proveedor[0] });
});


router.post('/edit/:id_pro', async (req, res) => {
    const { id_pro } = req.params;
    const { Nombre, Apellido, Empresa, Direccion } = req.body;
    const newProveedor = {
        Nombre,
        Apellido,
        Empresa,
        Direccion
    };
    await pool.query('UPDATE proveedor SET ? WHERE id_pro = ?', [newProveedor, id_pro]);
    req.flash('success', 'proveedor Updated Successfully');
    res.redirect('/proveedor');
});



module.exports = router;