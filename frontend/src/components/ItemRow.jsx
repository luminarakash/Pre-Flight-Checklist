export default function ItemRow({ item }) {
  return (
    <tr>
      <td>{item.text}</td>
      <td>{item.status}</td>
      <td>{item.comments}</td>
    </tr>
  );
}
