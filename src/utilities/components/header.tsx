import type { User } from "@/userModule/validators/userValidators"
import { Link } from "react-router";
import { adminRoutes } from "@/core/adminRoutes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogOut } from "../hooks/useLogOut";
import { useChangeColor } from "../hooks/useChangeColor";

interface DropDownMenuHeaderProps {
    user: User | null;
    token: string | null;
}

function DropDownMenuHeader({ user, token }: DropDownMenuHeaderProps) {
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
                <Link to="/payments">
                    <DropdownMenuItem>
                        Mis pagos
                    </DropdownMenuItem>
                </Link>
                {(user?.isAdmin && token) && adminRoutes.map((r) => (
                    <Link key={r.path} to={r.path}>
                        <DropdownMenuItem>
                            {r.path.replace('/', '') || 'admin'}
                        </DropdownMenuItem>
                    </Link>
                ))}
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
    const { logOut } = useLogOut();
    const [open, setOpen] = useState(false);
    const color = useChangeColor();

    const close = () => setOpen(false);

    return (
        <header className="w-full border-b bg-background">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {user && token &&
                        <div className="sm:hidden">
                            <Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label="Abrir menú">
                                <Menu className="size-5" />
                            </Button>
                        </div>
                    }
                    <Button variant="ghost" asChild>
                        <Link to="/" className="text-lg font-semibold">
                            <span
                                className="transition-colors duration-750"
                                style={{ color }}>
                                Corte
                            </span>
                            <span>
                                Laser
                            </span>
                        </Link>
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
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {(user && token) ? (
                        <>
                            <Badge variant="secondary">{user.names ?? user.email}</Badge>
                            <DropDownMenuHeader
                                user={user}
                                token={token}
                            />
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

            {open && user && token && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/40" onClick={close} />
                    <aside className="relative w-64 max-w-full bg-background border-r p-4">
                        <div className="flex items-center justify-between mb-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/" onClick={close} className="text-lg font-semibold">CorteLaser</Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={close} aria-label="Cerrar menú">
                                <X className="size-5" />
                            </Button>
                        </div>

                        <nav className="flex flex-col gap-2">
                            {(user && token) && (
                                <>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link to="/update" onClick={close}>Subir archivo</Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link to="/files" onClick={close}>Mis archivos</Link>
                                    </Button>
                                </>
                            )}

                            <div className="mt-4 border-t pt-4">
                                <div className="mb-2"><Badge variant="secondary">{user.names ?? user.email}</Badge></div>
                                <Button variant="ghost" size="sm" onClick={() => { logOut(); close(); }}>Cerrar Sesión</Button>
                            </div>
                        </nav>
                    </aside>
                </div>
            )}
        </header>
    )
}