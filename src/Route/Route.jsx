import { createBrowserRouter, RouterProvider } from "react-router";
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
import AddPublisher from "../Pages/Dashboard/AddPublisher/AddPublisher";
import AllArticlePage from "../Pages/AllArticlePage/AllArticlePage";
import ArticleDetails from "../Pages/ArticleDetails/ArticleDetails";
import Subscription from "../Pages/Subscription/Subscription";
import Payment from "../Pages/Payment/Payment";
import StripeTest from "../Pages/StripeTest/StripeTest";
import MyArticles from "../Pages/MyArticles/MyArticles";
import UpdateArticle from "../Pages/UpdateArticle/UpdateArticle";
import AdminRoute from "./AdminRoute";
import Forbidden from "../Pages/Forbidden/Forbidden";
import Dashboard from "../Pages/Dashboard/Dashboard/Dashboard";
import Profile from "../Pages/Profile/Profile";
import PremiumArticles from "../Pages/PremiumArticles/PremiumArticles";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/forbidden",
        Component: Forbidden,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/add-articles",
        element: (
          <PrivateRoute>
            <AddArticle></AddArticle>
          </PrivateRoute>
        ),
      },
      {
        path: "/premium-articles",
        element: (
          <PrivateRoute>
            <PremiumArticles></PremiumArticles>
          </PrivateRoute>
        ),
      },
      {
        path: "/all-articles",
        element: (
            <AllArticlePage></AllArticlePage>
        ),
      },
      {
        path: "/subscription",
        element: (
          <PrivateRoute>
            <Subscription></Subscription>
          </PrivateRoute>
        ),
      },
      {
        path: "/payment",
        element: (
          <PrivateRoute>
            <Payment></Payment>
          </PrivateRoute>
        ),
      },
      {
        path: "/article/:id",
        element: (
          <PrivateRoute>
            <ArticleDetails></ArticleDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-articles",
        element: (
          <PrivateRoute>
            <MyArticles></MyArticles>
          </PrivateRoute>
        ),
      },
      {
        path: "/update-article/:id",
        element: (
          <PrivateRoute>
            <UpdateArticle></UpdateArticle>
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
      {
        path: "/stripe-test",
        Component: StripeTest,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        {/* <AdminRoute> */}
          <DashboardLayout></DashboardLayout>
        {/* </AdminRoute> */}
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "all-users",
        Component: AllUsers,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "all-articles",
        Component: AllArticles,
      },
      {
        path: "add-publisher",
        Component: AddPublisher,
      },
      {
        path: "*",
        Component: Dashboard404,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
