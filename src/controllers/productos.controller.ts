import { Request, Response } from "express";
import Producto from "../models/productos.model";
import IProducto from "../interfaces/productos.interface";
import Venta from "../models/ventas.model";

// Get all resources
export const index = async (req: Request, res: Response) => {
    // agregar filtros

    try {
        const { ...data } = req.query; 
        let filters = { ...data };
        
        if (data.nombre) {
            filters = { ...filters, nombre: {$regex: data.nombre, $options: 'i'} }
        }

        let productos = await Producto.find(filters)
        .populate({ path: 'ventas', select: ['id', 'forma_de_pago', 'precio_total'] }); ;

        res.json(productos);
    } catch (error) {
        res.status(500).send('Algo salió mal');
    }
};

// Get one resource
export const show = async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        let producto = await Producto.findById(id);

        if (!producto)
            res.status(404).send(`No se encontró el producto con id: ${id}`);
        else
            res.json(producto);
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};

// Create a new resource
export const store = async (req: Request, res: Response) => {
    try {
        const { ...data } = req.body;

        const producto: IProducto = new Producto({
            nombre: data.nombre,
            precio: data.precio,
            stock: data.stock,
            estado: data.estado,
        });

        await producto.save();

        res.status(200).json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).send('Algo salió mal.');
    }
};

// Edit a resource
export const update = async (req: Request, res: Response) => {
    const id = req?.params?.id;
    const { ...data } = req.body;
    try {
        let producto = await Producto.findById(id);

        if (!producto)
            return res.status(404).send(`No se encontró el producto con id: ${id}`);
        
        if (data.nombre) producto.nombre = data.nombre;
        if (data.precio) producto.precio = data.precio;
        if (data.stock) producto.stock = data.stock;
        if (data.estado) producto.estado = data.estado;

        await producto.save();
        
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};

// Delete a resource
export const destroy = async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        let producto = await Producto.findByIdAndDelete(id);
        
        if (!producto)
            res.status(404).send(`No se encontró el producto con id: ${id}`);
        else
            res.status(200).json('Producto eliminado');
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};

export const agregarVenta = async (req: Request, res: Response) => {
    const productoId = req?.params?.productoId;
    const ventaId = req?.params?.ventaId;
    try {
        let producto = await Producto.findById(productoId);
        let venta = await Venta.findById(ventaId);

        if (!producto || !venta)
            res.status(404).send(`No se encontró el producto o la venta indicado.`);
        else {
            if (producto.stock <= 0)
                res.status(404).send(`El producto no tiene stock disponible.`);
            await venta?.productos.push(producto?.id);
            await producto?.ventas.push(venta?.id);

            venta.precio_total += producto.precio; 
            producto.stock--;
            
            await venta?.save();
            await producto?.save();
            res.status(201).json(producto);
        }
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};

export const borrarVenta = async (req: Request, res: Response) => {
    const productoId = req?.params?.productoId;
    const ventaId = req?.params?.ventaId;

    try {
        let producto = await Producto.findById(productoId);
        let venta = await Venta.findById(ventaId);

        if (!producto || !venta)
            res.status(404).send(`No se encontró el producto o la venta indicado.`);
        else {
            // buscar info acerca de transacciones
            let indiceVenta = Number(producto?.ventas.indexOf(ventaId));
            let indiceProducto = Number(venta?.productos.indexOf(productoId));

            if (indiceVenta === -1)
                res.status(404).send(`No se encontró la venta en el array de ventas del producto`);

            if (indiceProducto === -1)
                res.status(404).send(`No se encontró el producto en el array de productos de la venta`);

            producto?.ventas.splice(indiceVenta,1);
            venta?.productos.splice(indiceProducto,1);

            venta.precio_total -= producto.precio; 
            producto.stock++;

            await producto?.save();
            await venta?.save();
            

            res.status(201).json(producto);
        }
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};