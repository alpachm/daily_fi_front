import { ROUTES } from "../routes";

function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <a href={ROUTES.LOGIN}>Login</a>
                </li>
                <li>
                    <a href={ROUTES.BALANCE}>Balance</a>
                </li>
                <li>
                    <a href={ROUTES.DETAILS}>Details</a>
                </li>
                <li>
                    <a href={ROUTES.PROFILE}>Profile</a>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
