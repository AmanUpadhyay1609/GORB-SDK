export type DecoderFunction = (ix: {
  programId: string;
  data: Uint8Array;
  accounts: string[];
}) => { type: string; programId: string; accounts: string[]; data: Uint8Array; decoded?: Record<string, any> };

export class DecoderRegistry {
  private decoders: Map<string, DecoderFunction> = new Map();

  register(programId: string, decoder: DecoderFunction) {
    this.decoders.set(programId, decoder);
  }

  get(programId: string): DecoderFunction | undefined {
    return this.decoders.get(programId);
  }

  decode(ix: { programId: string; data: Uint8Array; accounts: string[] }) {
    const fn = this.get(ix.programId);
    if (!fn) {
      return { type: "unknown", programId: ix.programId, accounts: ix.accounts, data: ix.data };
    }
    return fn(ix);
  }
}


