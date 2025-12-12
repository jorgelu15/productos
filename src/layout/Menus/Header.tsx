import style from './header.module.css';
import { routes } from '../../utils/routes';
import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <header className={style.header}>
            <nav className={style.nav__header}>
                <ul className={style.nav__links}>
                    <li><Link to={routes.dashboard}>Prueba tecnica</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;