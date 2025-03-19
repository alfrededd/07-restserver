const { response } = require('express');
const { Producto } = require('../models');

//obtener todos los productos paginados
const obtenerProductos = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        productos
    });
}
//obtener el producto por un ID
const obtenerProducto = async(req, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( producto );

}
//crear el producto
const crearProducto = async(req, res = response ) => {
    //campos que voy almacenar y los que voy a omitir
    const { estado, usuario, ...body } = req.body;

    //verificar que no exista el producto con el mismo nombre en la BD
    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    //creacion del objeto para almacenar
    const producto = new Producto( data );

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);

}
//actualizar un producto
const actualizarProducto = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json( producto );

}
//borrar un producto
const borrarProducto = async(req, res = response ) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( productoBorrado );
}




module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}