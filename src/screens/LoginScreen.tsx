import { Link } from "@tanstack/react-router";
import { ROUTES } from "../routes";

function LoginScreen() {
    return (
        <div>
            <h2>LOGIN</h2>
            <Link to={ROUTES.BALANCE}>Login</Link>
        </div>
    );
}

export default LoginScreen;
