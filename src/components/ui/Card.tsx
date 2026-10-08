

interface ICard{
  title?: string,
  value?: string,
  description?: string,
}

function Card({
  title,
  value,
  description
}: ICard) {
  return (
    <div
    className="text-text bg-card border-2 border-border
    p-5 h-35 rounded-xl shadow
    flex flex-col gap-1.5
    ">
      
      <p 
      className="uppercase text-[10px] text-text-muted">
        {title}
      </p>

      <p
      className="font-heading text-xl font-medium">
        {value}
      </p>

      <p className="text-[10px] text-text-muted">
        {description}
      </p>

    </div>
  )
}

export default Card