import { Document } from 'mongoose'

export default interface IPerson extends Document {
  _id: string,
  nombreCompleto: string;
  email: string;
  contraseña: string;
  telefono: string;
  rol: string,
  createdAt: Date;
  updatedAt: Date;
};