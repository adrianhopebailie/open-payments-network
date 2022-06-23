export default function HomeRoute() {
  return (
    <main>
      <h1>Open Payments Network</h1>
      <p>A registry of clients using Open Payments to access accounts.</p>
      <p><a href="/register">Register</a> to become a client.</p>
      <p><a href="/login">Login</a> to update your details and keys.</p>
      <p>Clients access resource and authorisation servers in the Open Payments network via the Open Payments APIs.</p>
      <p>Their requests are secured using keys stored in the Open Payments Network Registry.</p>
    </main>
  );
}
