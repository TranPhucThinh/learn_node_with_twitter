import { Request, Response } from 'express'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'thinh@gmail.com' && password === '123123') {
    res.json({ message: 'Login success' })
  } else {
    res.status(401).json({ error: 'Invalid email or password' })
  }
}
