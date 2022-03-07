import { model, Schema } from 'mongoose';
import IProduct from '../interfaces/productos.interface';

const ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio']
    },
    estado: {
        type: String,
        required: [true, 'El estado es obligatorio. Valores posibles: nuevo/usado'],
        enum: ['nuevo', 'usado']
    },
    ventas: [{
        type: Schema.Types.ObjectId,
        ref: 'Venta'
      }]
}, {
    timestamps: { createdAt: true, updatedAt: true }
})

export default model<IProduct>('Product', ProductoSchema);