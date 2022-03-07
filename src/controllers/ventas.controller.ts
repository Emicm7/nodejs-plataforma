import { Request, Response } from "express";
import IVentas from "../interfaces/ventas.interface";
import Venta from "../models/ventas.model";
import Producto from "../models/productos.model";

// Get all resources
export const index = async (req: Request, res: Response) => {
    // agregar filtros

    try {
        
        const ventas = await Venta.find()
        .populate({ path: 'persona_id', select: ['id', 'nombre', 'email', 'rol'] })
        .populate({ path: 'productos', select: ['id', 'nombre', 'precio', 'stock'] })
        console.log(ventas);

        res.json(ventas);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

// Get one resource
export const show = async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        let venta = await Venta.findById(id)
        .populate({ path: 'persona_id', select: ['id', 'nombre', 'email', 'rol'] })
        .populate({ path: 'productos', select: ['id', 'nombre', 'precio', 'stock'] })

        if (!venta)
            res.status(404).send(`No se encontró la venta con id: ${id}`);
        else
            res.json(venta);
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};

// Create a new resource
export const store = async (req: Request, res: Response) => {
    try {
        const { ...data } = req.body;

        const venta: IVentas = new Venta({
            forma_de_pago: data.forma_de_pago,
            precio_total: 0,
            estado: data.estado,
            persona_id: data.persona_id,
        });

        
        await venta.save();

        res.status(200).json(venta);
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
        let venta = await Venta.findById(id);

        if (!venta)
            return res.status(404).send(`No se encontró el alumno con id: ${id}`);
        
        if (data.forma_de_pago) venta.forma_de_pago = data.forma_de_pago;
        if (data.precio_total) venta.precio_total = data.precio_total;
        if (data.persona_id) venta.persona_id = data.persona_id;
        if (data.estado) venta.estado = data.estado;

        await venta.save();
        
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};

// Delete a resource
export const destroy = async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        let venta = await Venta.findByIdAndDelete(id);

        if (!venta)
            res.status(404).send(`No se encontró el alumno con el id: ${id}`);
        
        else 
            res.status(200).json('La venta ha sido ANULADA');
    
        
                
        
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};

// Create a new resource
export const agregarProductoToVenta = async (req: Request, res: Response) => {
    try {
        const productoId = req?.params?.productoId;
        const ventaId = req?.params?.ventaId;

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
        }

        res.status(200).json(venta);
    } catch (error) {
        console.log(error);
        res.status(500).send('Algo salió mal.');
    }
};

export const borrarProductoToVenta = async (req: Request, res: Response) => {
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

            await venta?.save();
            await producto?.save();

            res.status(201).json(venta);
        }
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};