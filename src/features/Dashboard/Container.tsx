import { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useShortcuts } from "../../hooks/useShortcodes"; // ajusta la ruta según tu estructura
import style from "./container.module.css";
import clientes from "../../assets/clientes.png";
import InventarioFisico from "../../assets/inventario.png";
import { routes } from "../../utils/routes";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
const CardMenu = lazy(() => import("../../components/cards/CardMenu"));

const menuItems = [
    { shortcode: "1", image: clientes, title: "Categorias", codigo_permiso: "CLIENTES", destiny: routes.categorias },
    { shortcode: "2", image: InventarioFisico, title: "Productos", codigo_permiso: "GESTION_INVENTARIO", destiny: routes.InventarioFisico },
];

const items = [
    { label: "Dashboard", href: "/" },
];

const Container = () => {
    const navigate = useNavigate();

    // Construir los atajos a partir de menuItems
    const shortcuts = menuItems.reduce((map, item) => {
        map[item.shortcode] = () => navigate(item.destiny);
        return map;
    }, {} as Record<string, () => void>);

    useShortcuts(shortcuts);

    return (
        <div className={"container"}>
            <Breadcrumb items={items} />
            <div className={style.cards}>
                {
                    menuItems.map((item, index) => (
                        <CardMenu
                            key={index}
                            shortcode={item.shortcode}
                            image={item.image}
                            title={item.title}
                            redirect={() => navigate(item.destiny)}
                            to={item.destiny}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Container;
