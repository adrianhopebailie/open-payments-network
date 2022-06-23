import { NavLink } from "remix";

export default function Menu() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          Directory
          <ul>
            <li>
              <NavLink to="/directory/clients">Clients</NavLink>
            </li>
            <li>
              <NavLink to="/directory/keys">Keys</NavLink>
            </li>
          </ul>
        </li>
        <li>
          <NavLink to="/login">Login/Register</NavLink>
        </li>
      </ul>
    </nav>

  )
}