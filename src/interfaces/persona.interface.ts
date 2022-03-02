import { Document } from 'mongoose'

export default interface IPerson extends Document {
  _id: string,
  nombre: string;
  email: string;
  contraseña: string;
  telefono: string;
  rol: string,
  createdAt: Date;
  updatedAt: Date;
};