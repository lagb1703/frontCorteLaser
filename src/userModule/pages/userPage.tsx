import UserReview from "../components/userReview";

export default function UserPage() {
    return (
        <div>
            <h1
                className="text-4xl font-bold my-6 text-center">
                Perfil de Usuario
            </h1>
            <main
                className="flex justify-center">
                <UserReview disable={false} />
            </main>
        </div>
    );
}