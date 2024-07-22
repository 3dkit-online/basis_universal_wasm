import {BASIS} from "./transcoder/basis_transcoder.js"

export const importBasisTranscoder:()=>Promise<BasisTranscoderModule> = BASIS;

// export const BasisTranscoderModule:BasisTranscoderModule = await importBasisTranscoderFn();

