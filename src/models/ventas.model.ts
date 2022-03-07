import { model, Schema } from 'mongoose';
import IVentas from '../interfaces/ventas.interface';

const VentasSchema = new Schema({
  forma_de_pago: {
    type: String,
    required: [true, 'La forma de pago es obligatorio. Valores posibles: contado/tarjeta'],
    enum: ['contado', 'tarjeta']
  },
  precio_total: {
    type: Number,
    required: [true, 'El precio es obligatorio']
  },
  estado: {
    type: String,
    required: [true, 'El estado es obligatorio. Valores posibles: APROBADA/ANULADA'],
    enum: ['APROBADA', 'ANULADA']
  },
  persona_id: {
    type: Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  productos: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }]
}, {
  timestamps: { createdAt: true, updatedAt: true }
})

export default model<IVentas>('Venta', VentasSchema);