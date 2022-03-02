import { Request, Response } from "express";
import Persona from "../models/persona.model";
import IPersona from "../interfaces/persona.interface";

// Get all resources
export const index = async (req: Request, res: Response) => {
    // agregar filtros

    try {
        const { ...data } = req.query; 
        let filters = { ...data };
        
        if (data.nombre) {
            filters = { ...filters, nombre: {$regex: data.nombre, $options: 'i'} }
        }

        let personas = await Persona.find(filters);

        res.json(personas);
    } catch (error) {
        res.status(500).send('Algo salió mal');
    }
};

// Get one resource
export const show = async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        let persona = await Persona.findById(id);

        if (!persona)
            res.status(404).send(`No se encontró la persona con id: ${id}`);
        else
            res.json(persona);
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};

// Create a new resource
export const store = async (req: Request, res: Response) => {
    try {
        const { ...data } = req.body;

        const persona: IPersona = new Persona({
            nombre: data.nombre,
            email: data.email,
            contraseña: data.contraseña,
            telefono: data.telefono,
            rol: data.rol,
        });

        await persona.save();

        res.status(200).json(persona);
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
        let persona = await Persona.findById(id);

        if (!persona)
            return res.status(404).send(`No se encontró la persona con id: ${id}`);
        
        if (data.nombre) persona.nombre = data.nombre;
        if (data.precio) persona.email = data.email;
        if (data.stock) persona.contraseña = data.contraseña;
        if (data.estado) persona.telefono = data.telefono;
        if (data.estado) persona.rol = data.rol;

        await persona.save();
        
        res.status(200).json(persona);
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};

// Delete a resource
export const destroy = async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        let persona = await Persona.findByIdAndDelete(id);
        console.log(persona);
        if (!persona)
            res.status(404).send(`No se encontró la persona con id: ${id}`);
        else
            res.status(200).json(persona);
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};