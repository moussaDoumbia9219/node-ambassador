import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {

  const {password, password_confirm, ...body} = req.body;

  if (password !== password_confirm) {
    return res.status(404).send(
      {
        message: "password do not match",
      }
    )
  }

  const user = await getRepository(User).save({
    ...body,
    password: await bcryptjs.hash(body.password, 10),
    is_ambassador: false

  })

  delete user.password;

  res.send(user)
}

export const Login = async (req: Request, res: Response) => {
  const user = await getRepository(User).findOne({
    where: {
      email: req.body.email
    },
    select: ["id", "password"]
  });

  if (!user) {
    return res.status(404).send({
      message: "Invalid username"
    })
  }

  if (! await bcryptjs.compare(req.body.password, user.password)) {
    return res.status(404).send({
      message: "Invalid credentials"
    });
  }

  const token = sign({
    id: user.id
  }, process.env.SECRET_KEY);

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000// 1 Day
  })

  res.send({
    message: "success"
  });
}


export const AuthenticatedUSer = async (req: Request, res: Response) => {
  try {
    const jwt = req.cookies["jwt"];
    const payload: any = verify(jwt, process.env.SECRET_KEY);

    if (!payload) {
      return res.status(404).send({
        message: "unauthenticated"
      });
    }

    const user = await getRepository(User).findOne({
      where: {
        id: payload.id
      }
    });

    res.send(user);
  } catch (error) {
    return res.status(404).send({
      message: "unauthenticated"
    });
  }
}

export const Logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({
    message: "success"
  })
}