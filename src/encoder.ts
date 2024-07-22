import {BASIS} from "./encoder/basis_encoder.js"

export const importBasisEncoder:()=>Promise<BasisEncoderModule> = BASIS;

// export const BasisEncoderModule:BasisEncoderModule = await importBasisEncoderFn();

