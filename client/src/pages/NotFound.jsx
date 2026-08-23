import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>That page doesn't exist.</p>

      <Link to="/shop">Back to shop</Link>
    </div>
  );
}

export default NotFound;
