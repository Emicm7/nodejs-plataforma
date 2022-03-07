import { model, Schema } from 'mongoose';
import IPerson from '../interfaces/persona.interface';

const PersonaSchema = new Schema({
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatoria']
    },
    contraseña: {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    telefono: {
        type: String,
        required: [false]
    },
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio. Valores posibles: admin/cliente'],
        enum: ['admin', 'cliente']
    }
}, {
    timestamps: { createdAt: true, updatedAt: true }
})

export default model<IPerson>('Person', PersonaSchema);