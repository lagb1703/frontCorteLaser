import LoginForm from "../components/loginForm";

export default function LoginPage() {
    return (
        <div
            className="flex justify-around">
            <section
                className="basis-1/2 hidden lg:flex justify-center items-center">
                <img
                    className='max-h-[420px] max-w-full object-contain'
                    src="/homeLazer.png"
                    alt="Imagen ilustrativa de corte láser" />
            </section>
            <main
                className="basis-1/2 h-full flex justify-center items-center">
                <LoginForm />
            </main>
        </div>
    );
}