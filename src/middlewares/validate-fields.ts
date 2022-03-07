import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const validateFields = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  // console.log(errors)
  
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  next() // si llego hasta acá, entonces que siga con el siguiente middleware
}
