import { useParams } from 'react-router-dom';

const UserProfilePage = () => {
  const { email } = useParams();


  return (
    <div>
      <h1>User Profile: {email}</h1>
      {/* Render user profile information */}
    </div>
  );
};

export default UserProfilePage;