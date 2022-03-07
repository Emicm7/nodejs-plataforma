import { Request, Response } from "express";
import Persona from "../models/persona.model";
import IPersona from "../interfaces/persona.interface";
import bcrypt from 'bcrypt';

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
        const password = await bcrypt.hash(data.contraseña, 5);

        const persona: IPersona = new Persona({
            nombreCompleto: data.nombreCompleto,
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
        
        if (data.nombreCompleto) persona.nombreCompleto = data.nombreCompleto;
        if (data.email) persona.email = data.email;
        if (data.contraseña) persona.contraseña = data.contraseña;
        if (data.telefono) persona.telefono = data.telefono;
        if (data.rol) persona.rol = data.rol;

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
        
        if (!persona)
            res.status(404).send(`No se encontró la persona con id: ${id}`);
        else
            res.status(200).json(persona);
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};

// Login a person
export const login = async (req: Request, res: Response) => {
    // email y contraseña
    try {
        
        const { ...data } = req.body;
        let persona = await Persona.findOne({ email: data.email});

        if (!persona)
            res.status(404).send(`No se encontró la persona con el email: ${data.email}`);
        else{
            // comparar contraseña de la persona con la contraseña pasada por el body
            const sonIguales = await bcrypt.compare(data.contraseña, persona.contraseña);
            console.log(sonIguales);

            if (sonIguales) {

                res.status(200).json('ok');
            } else {

                res.status(401).json('datos incorrectos');
            }
        }
    } catch (error) {
        res.status(500).send('Algo salió mal.');
    }
};