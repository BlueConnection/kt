import "./Keycap.css";

type KeycapProps = {
  character: string;
  isPressed: boolean;
};

const Keycap = ({ character, isPressed }: KeycapProps) => {
  let className =
    "flex justify-center items-center border-2 rounded w-14 h-14 text-xl keycap";

  if (isPressed) {
    className = `${className} pressed`;
  }

  return <div className={className}>{character}</div>;
};

export default Keycap;
