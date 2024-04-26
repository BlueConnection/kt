type KeycapProps = {
  character: string;
};

const Keycap = ({ character }: KeycapProps) => {
  return (
    <div className="flex justify-center items-center border-2 rounded w-10 h-10">
      {character}
    </div>
  );
};

export default Keycap;
