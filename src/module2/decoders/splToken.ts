import type { DecoderFunction } from "./registry";

// Gorbchain Token-2022 program
export const TOKEN22_PROGRAM_ID = "G22oYgZ6LnVcy7v8eSNi2xpNk1NcZiPD8CVKSTut7oZ6";

export const decodeSPLTokenInstruction: DecoderFunction = (ix) => {
  // Very light heuristic: first byte often indicates instruction variant
  const discriminator = ix.data[0] ?? 255;
  let type = `spl-token:${discriminator}`;
  return { type, programId: ix.programId, accounts: ix.accounts, data: ix.data };
};


