
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Root from "../Layout/Root";
import Home from "../Pages/Home/Home";
import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children : [
        {
            index : true,
            Component : Home
        },
        {
            path: '/register',
            Component : Register
        },
        {
            path: '/login',
            Component : Login
        }
    ]
  },
]);