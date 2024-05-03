export type LossByLetGoInformation = {
  level: number;
  sequence: string;
  character: string;
};

export type LossByWrongInputInformation = {
  level: number;
  sequence: string;
  character: string;
  expectedCharacter: string;
};

export type LossByTimeInformation = {
  level: number;
  sequence: string;
};
