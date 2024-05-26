import * as React from "react"
import {
  ChakraProvider,
  extendTheme
} from "@chakra-ui/react"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./screens/Home";
import Register from "./screens/Register";
import SignIn from "./screens/SignIn";
import Listing from "./screens/Listing";
import ViewListing from "./screens/View/Listing";
import Cart from "./screens/Cart";

import AdminHome from "./screens/Admin/Home";
import AdminUsers from "./screens/Admin/Users";
import AdminPackages from "./screens/Admin/Packages";
import AdminCreateLead from "./screens/Admin/createLead";
import AdminLogin from './screens/Admin/Login'
import AdminFacebookLeads from './screens/Admin/FacebookLeads'
import AdminJamalLeads from "./screens/Admin/jamal/JamalLeads";
import AdminCreateJamalLeads from "./screens/Admin/jamal/createJamalLeads";

import UserHome from "./screens/User/Home";

import ErrorPage from "./screens/error-page";

import Demo from "./screens/Demo";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/signin',
    element: <SignIn />
  },
  {
    path: '/listing/search',
    element: <Listing />
  },
  {
    path: '/listing/:id/:name',
    element: <ViewListing />
  },
  {
    path: '/cart',
    element: <Cart />
  },
  {
    path: '/admin',
    element: <AdminLogin />
  },
  {
    path: '/admin/home',
    element: <AdminHome />
  },
  {
    path: '/admin/users',
    element: <AdminUsers />
  },
  {
    path: '/admin/packages',
    element: <AdminPackages />
  },
  {
    path: '/admin/db/jamal',
    element: <AdminJamalLeads />
  },
  {
    path: '/admin/scrap/leads/jamalpages',
    element: <AdminCreateJamalLeads />
  },
  {
    path: '/admin/create/package',
    element: <AdminCreateLead />
  },
  {
    path: '/admin/db/facebook',
    element: <AdminFacebookLeads />
  },
  {
    path: '/dashboard/',
    element: <UserHome />
  },
  {
    path: '/demo',
    element: <Demo />
  },
]);

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
  app: {
    mlight: '#C5DFF8',
    mdark: '#4A55A2'
  }
}

const theme = extendTheme({ colors })

export const App = () => (
  <ChakraProvider theme={theme}>
    <RouterProvider router={router} />
  </ChakraProvider>
)
