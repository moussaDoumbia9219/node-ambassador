import { AuthMiddleWare } from './middleware/auth.middleware';
import { Request, Response, Router } from "express";
import { AuthenticatedUSer, Login, Logout, Register } from "./controller/auth.controller";

export const routes = (router: Router) => {
  router.post('/api/admin/register', Register);
  router.post('/api/admin/login', Login);
  router.get('/api/admin/user', AuthMiddleWare, AuthenticatedUSer)
  router.post('/api/admin/logout', Logout)
}