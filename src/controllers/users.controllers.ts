import { Request, Response } from 'express'
import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'thinh@gmail.com' && password === '123123') {
    res.json({ message: 'Login success' })
  } else {
    res.status(401).json({ error: 'Invalid email or password' })
  }
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = await usersService.register({ email, password })

    res.json({ message: 'Register success', result })
  } catch (error) {
    res.status(400).json({ message: 'Register fail', error })
  }
}
