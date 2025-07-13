
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Root from "../Layout/Root";
import Home from "../Pages/Home/Home";
import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";
import AddArticle from "../Pages/AddArticle/AddArticle";
import DashboardLayout from "../Layout/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import Dashboard404 from "../Pages/Dashboard/PageNotFound/Dashboard404";
import AllUsers from "../Pages/Dashboard/AllUsers/AllUsers";
import NotFound from "../Pages/NotFound/NotFound";
import AllArticles from "../Pages/Dashboard/AllArticles/AllArticles";

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
        },
        {
            path: '/add-articles',
            element: <PrivateRoute>
                <AddArticle></AddArticle>
            </PrivateRoute>
        },
    ]
  },
  {
    path: '/dashboard',
    element : <PrivateRoute>
        <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    children : [
        {
            path: 'all-users',
            Component: AllUsers
        },
        {
            path: 'all-articles',
            Component: AllArticles
        },
        {
            path: "*",
            Component: Dashboard404
        }
    ]
  },
  {
    path: "*",
    Component: NotFound
  }
]);