import UserReview from "../components/userReview";

export default function UserPage() {
    return (
        <div>
            <h1>Perfil de Usuario</h1>
            <UserReview disable={false} />
        </div>
    );
}