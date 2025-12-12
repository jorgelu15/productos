import Container from "../../features/Categorias/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Categorias = () => {
    useTitle();

    return (
        <>
            <Header />
            <Container />
        </>
    );
}

export default Categorias;