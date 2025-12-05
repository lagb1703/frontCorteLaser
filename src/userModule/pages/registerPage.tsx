import RegisterForm from "../components/registerForm";
import { useChangeColor } from '@/utilities/hooks/useChangeColor';

export default function RegisterPage() {
    const color = useChangeColor();
    return (
        <div
            className="w-full">
            <h1
                className="text-4xl font-bold w-full text-center my-10">
                <span className="transition-colors duration-750" style={{ color }}>Registro </span>
                <span>de Usuario</span>    
            </h1>
            <main
                className="flex w-full min-h-[50%] flex-col items-center justify-center">
                <div
                    className="w-[90%] lg:w-[50%]">
                    <RegisterForm />
                </div>
            </main>
        </div>
    );
}