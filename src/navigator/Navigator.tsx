import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "../utils/routes";
import { Suspense } from "react";
import Dashboard from "../pages/Dashboard/Dashboard";
import InventarioFisico from "../pages/InventarioFisico/InventarioFisico";
import Categorias from "../pages/Categorias/Categorias";



const router = createBrowserRouter([
    {
        path: routes.InventarioFisico,
        element: <Suspense fallback={<p>Loading...</p>}><InventarioFisico /></Suspense>,
    },
    {
        path: routes.categorias,
        element: <Suspense fallback={<p>Loading...</p>}><Categorias /></Suspense>,
    },
    {
        path: routes.dashboard,
        element: <Suspense fallback={<p>Loading...</p>}><Dashboard /></Suspense>,
    },
]);
const Navigator = () => {
    return (
        <RouterProvider router={router} />
    );
}

export default Navigator;