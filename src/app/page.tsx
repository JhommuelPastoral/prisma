
declare global {
  var Name: string;
}
globalThis.Name  = "world"

export default function Home() {
  

  return (
    <div>Home</div>
  );
}