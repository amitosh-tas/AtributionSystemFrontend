

interface IPill{
  name: string,
}

function Pill( { name }: IPill ) {
  return (
    <div
    className="
    px-3 py-1 
    w-min rounded-full 
    text-sm font-semibold text-red-700 
    bg-red-700/20
    "
    >
      {name}
    </div>
  )
}

export default Pill