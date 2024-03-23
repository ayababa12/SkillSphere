import { useParams } from 'react-router-dom';

const UserProfilePage = () => {
  const { email } = useParams();
console.log(email)
  // Fetch user data based on the username and render the profile
  // ...

  return (
    <div>
      <h1>User Profile: {email}</h1>
      {/* Render user profile information */}
    </div>
  );
};

export default UserProfilePage;