import Persona from '../models/persona.model';
import Producto from '../models/productos.model';

export const validPersonaId = async (personaId: number) => {
  const persona = await Persona.findById(personaId)

  if (persona === null) {
    throw new Error(`La persona con id ${personaId} no está registrada.`)
  }
}
export const validPersonaEmail = async (personaEmail: string) => {
  const persona = await Persona.findOne({ email: personaEmail});

  if (persona !== null) {
    throw new Error(`La persona con email ${personaEmail} está registrada. Ingrese otro email`)
  }
}

export const validProductoId = async (productoId: number) => {
  const producto = await Producto.findById(productoId)

  if (producto === null) {
    throw new Error(`El producto con id ${productoId} no está registrada.`)
  }
}