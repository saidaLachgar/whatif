import "./index.scss";

interface Props {
  count: number,
  limit: number,
}

const CharacterCount = ({ count, limit }: Props): JSX.Element | null => {

  if (!count) {
    return null;
  }

  return (
    <svg
      viewBox="0 0 36 36"
      className="CharacterCount"
      style={{
        ['--color' as string]: `var(${count <= limit / 2 ? "--color-green" : (count <= limit ? "--color-orange" : "--color-red")})`,
      }}
    >
      <path className="CharacterCount__Bg"
        d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path className="CharacterCount__Stroke"
        strokeDasharray={`${Math.floor((count * 100) / limit)}, 100`}
        d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text x="18" y="21" className="CharacterCount__Value">{count <= limit ? count : limit - count}</text>
    </svg>
  )
}
export default CharacterCount
