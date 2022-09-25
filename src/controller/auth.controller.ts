import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";

export const Register = async (req: Request, res: Response) => {

  const body = req.body;

  if (body.password !== body.password_confirm) {
    return res.status(404).send(
      {
        message: "password do not match",
      }
    )
  }

  const { password, ...user } = await getRepository(User).save({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: await bcryptjs.hash(body.password, 10),
    is_ambassador: false

  })

  res.send(user)
}

export const Login = async (req: Request, res: Response) => {
  const {password, ...user} = await getRepository(User).findOne({
    where: {
      email: req.body.email
    }
  });

  if (!user) {
    return res.status(404).send({
      message: "Invalid username"
    })
  }

  if (! await bcryptjs.compare(req.body.password, password)) {
    return res.status(404).send({
      message: "Invalid credentials"
    });
  }

  res.send(user);
}
