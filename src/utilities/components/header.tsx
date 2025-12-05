import type { User } from "@/userModule/validators/userValidators"
import { Link } from "react-router";
import { adminRoutes } from "@/core/adminRoutes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogOut } from "../hooks/useLogOut";

function DropDownMenuHeader() {
    const { logOut } = useLogOut();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                    Opciones
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <Link to="/user">
                    <DropdownMenuItem>
                        Perfil
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logOut}>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface Props {
    user?: User | null;
    token?: string | null;
}

export default function Header({ user, token }: Props) {

    return (
        <header className="w-full border-b bg-background">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link to="/" className="text-lg font-semibold">CorteLaser</Link>
                    </Button>

                    <nav className="hidden sm:flex items-center gap-2">

                        {(user && token) && (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/update">Subir archivo</Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/files">Mis archivos</Link>
                                </Button>
                            </>
                        )}

                        {(user?.isAdmin && token) && adminRoutes.map((r) => (
                            <Button key={r.path} variant="ghost" size="sm" asChild>
                                <Link to={r.path}>{r.path.replace('/', '') || 'admin'}</Link>
                            </Button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {(user && token) ? (
                        <>
                            <Badge variant="secondary">{user.names ?? user.email}</Badge>
                            <DropDownMenuHeader />
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button size="sm" asChild>
                                <Link to="/login">Iniciar sesión</Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                                <Link to="/register">Registrar</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}