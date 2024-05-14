import "./Keycap.css";

type KeycapProps = {
  character: string;
  isPressed: boolean;
};

const Keycap = ({ character, isPressed }: KeycapProps) => {
  let className =
    "flex justify-center items-center border-2 rounded-2xl w-16 h-16 text-2xl keycap";

  if (isPressed) {
    className = `${className} pressed`;
  }

  return <div className={className}>{character}</div>;
};

export default Keycap;
