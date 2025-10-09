import type { DecoderFunction } from "./registry";

export const SystemProgramId = "11111111111111111111111111111111";

export const decodeSystemInstruction: DecoderFunction = (ix) => {
  // Minimal: classify by data length
  let type = "unknown";
  if (ix.data.length === 0) type = "nop";
  else if (ix.data[0] === 2) type = "transfer"; // heuristic

  return { type, programId: ix.programId, accounts: ix.accounts, data: ix.data };
};


