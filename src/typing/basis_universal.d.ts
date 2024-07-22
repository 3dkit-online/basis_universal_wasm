enum basis_tex_format {
  cETC1S,
  cUASTC4x4,
}

declare enum ktx2_supercompression {
  KTX2_SS_NONE = 0,
  KTX2_SS_BASISLZ = 1,
  KTX2_SS_ZSTANDARD = 2
}

declare enum ktx2_df_channel_id {
  KTX2_DF_CHANNEL_ETC1S_RGB = 0,
  KTX2_DF_CHANNEL_ETC1S_RRR = 3,
  KTX2_DF_CHANNEL_ETC1S_GGG = 4,
  KTX2_DF_CHANNEL_ETC1S_AAA = 15,

  KTX2_DF_CHANNEL_UASTC_DATA = 0,
  KTX2_DF_CHANNEL_UASTC_RGB = 0,
  KTX2_DF_CHANNEL_UASTC_RGBA = 3,
  KTX2_DF_CHANNEL_UASTC_RRR = 4,
  KTX2_DF_CHANNEL_UASTC_RRRG = 5,
  KTX2_DF_CHANNEL_UASTC_RG = 6,
}

declare enum ktx2_df_color_primaries {
  KTX2_DF_PRIMARIES_UNSPECIFIED = 0,
  KTX2_DF_PRIMARIES_BT709 = 1,
  KTX2_DF_PRIMARIES_SRGB = 1,
  KTX2_DF_PRIMARIES_BT601_EBU = 2,
  KTX2_DF_PRIMARIES_BT601_SMPTE = 3,
  KTX2_DF_PRIMARIES_BT2020 = 4,
  KTX2_DF_PRIMARIES_CIEXYZ = 5,
  KTX2_DF_PRIMARIES_ACES = 6,
  KTX2_DF_PRIMARIES_ACESCC = 7,
  KTX2_DF_PRIMARIES_NTSC1953 = 8,
  KTX2_DF_PRIMARIES_PAL525 = 9,
  KTX2_DF_PRIMARIES_DISPLAYP3 = 10,
  KTX2_DF_PRIMARIES_ADOBERGB = 11
}
// The image type field attempts to describe how to interpret the image data in a Basis file.
// The encoder library doesn't really do anything special or different with these texture types, this is mostly here for the benefit of the user. 
// We do make sure the various constraints are followed (2DArray/cubemap/videoframes/volume implies that each image has the same resolution and # of mipmap levels, etc., cubemap implies that the # of image slices is a multiple of 6)
declare enum basis_texture_type {
  cBASISTexType2D = 0,					// An arbitrary array of 2D RGB or RGBA images with optional mipmaps, array size = # images, each image may have a different resolution and # of mipmap levels
  cBASISTexType2DArray = 1,			// An array of 2D RGB or RGBA images with optional mipmaps, array size = # images, each image has the same resolution and mipmap levels
  cBASISTexTypeCubemapArray = 2,	// an array of cubemap levels, total # of images must be divisable by 6, in X+, X-, Y+, Y-, Z+, Z- order, with optional mipmaps
  cBASISTexTypeVideoFrames = 3,		// An array of 2D video frames, with optional mipmaps, # frames = # images, each image has the same resolution and # of mipmap levels
  cBASISTexTypeVolume = 4,			// A 3D texture with optional mipmaps, Z dimension = # images, each image has the same resolution and # of mipmap levels

  cBASISTexTypeTotal
}

enum transcoder_texture_format {
  // Compressed formats

  // ETC1-2
  cTFETC1_RGB = 0,							// Opaque only, returns RGB or alpha data if cDecodeFlagsTranscodeAlphaDataToOpaqueFormats flag is specified
  cTFETC2_RGBA = 1,							// Opaque+alpha, ETC2_EAC_A8 block followed by a ETC1 block, alpha channel will be opaque for opaque .basis files

  // BC1-5, BC7 (desktop, some mobile devices)
  cTFBC1_RGB = 2,							// Opaque only, no punchthrough alpha support yet, transcodes alpha slice if cDecodeFlagsTranscodeAlphaDataToOpaqueFormats flag is specified
  cTFBC3_RGBA = 3, 							// Opaque+alpha, BC4 followed by a BC1 block, alpha channel will be opaque for opaque .basis files
  cTFBC4_R = 4,								// Red only, alpha slice is transcoded to output if cDecodeFlagsTranscodeAlphaDataToOpaqueFormats flag is specified
  cTFBC5_RG = 5,								// XY: Two BC4 blocks, X=R and Y=Alpha, .basis file should have alpha data (if not Y will be all 255's)
  cTFBC7_RGBA = 6,							// RGB or RGBA, mode 5 for ETC1S, modes (1,2,3,5,6,7) for UASTC

  // PVRTC1 4bpp (mobile, PowerVR devices)
  cTFPVRTC1_4_RGB = 8,						// Opaque only, RGB or alpha if cDecodeFlagsTranscodeAlphaDataToOpaqueFormats flag is specified, nearly lowest quality of any texture format.
  cTFPVRTC1_4_RGBA = 9,					// Opaque+alpha, most useful for simple opacity maps. If .basis file doesn't have alpha cTFPVRTC1_4_RGB will be used instead. Lowest quality of any supported texture format.

  // ASTC (mobile, Intel devices, hopefully all desktop GPU's one day)
  cTFASTC_4x4_RGBA = 10,					// Opaque+alpha, ASTC 4x4, alpha channel will be opaque for opaque .basis files. Transcoder uses RGB/RGBA/L/LA modes, void extent, and up to two ([0,47] and [0,255]) endpoint precisions.

  // ATC (mobile, Adreno devices, this is a niche format)
  cTFATC_RGB = 11,							// Opaque, RGB or alpha if cDecodeFlagsTranscodeAlphaDataToOpaqueFormats flag is specified. ATI ATC (GL_ATC_RGB_AMD)
  cTFATC_RGBA = 12,							// Opaque+alpha, alpha channel will be opaque for opaque .basis files. ATI ATC (GL_ATC_RGBA_INTERPOLATED_ALPHA_AMD) 

  // FXT1 (desktop, Intel devices, this is a super obscure format)
  cTFFXT1_RGB = 17,							// Opaque only, uses exclusively CC_MIXED blocks. Notable for having a 8x4 block size. GL_3DFX_texture_compression_FXT1 is supported on Intel integrated GPU's (such as HD 630).
  // Punch-through alpha is relatively easy to support, but full alpha is harder. This format is only here for completeness so opaque-only is fine for now.
  // See the BASISU_USE_ORIGINAL_3DFX_FXT1_ENCODING macro in basisu_transcoder_internal.h.

  cTFPVRTC2_4_RGB = 18,					// Opaque-only, almost BC1 quality, much faster to transcode and supports arbitrary texture dimensions (unlike PVRTC1 RGB).
  cTFPVRTC2_4_RGBA = 19,					// Opaque+alpha, slower to encode than cTFPVRTC2_4_RGB. Premultiplied alpha is highly recommended, otherwise the color channel can leak into the alpha channel on transparent blocks.

  cTFETC2_EAC_R11 = 20,					// R only (ETC2 EAC R11 unsigned)
  cTFETC2_EAC_RG11 = 21,					// RG only (ETC2 EAC RG11 unsigned), R=opaque.r, G=alpha - for tangent space normal maps

  // Uncompressed (raw pixel) formats
  cTFRGBA32 = 13,							// 32bpp RGBA image stored in raster (not block) order in memory, R is first byte, A is last byte.
  cTFRGB565 = 14,							// 16bpp RGB image stored in raster (not block) order in memory, R at bit position 11
  cTFBGR565 = 15,							// 16bpp RGB image stored in raster (not block) order in memory, R at bit position 0
  cTFRGBA4444 = 16,							// 16bpp RGBA image stored in raster (not block) order in memory, R at bit position 12, A at bit position 0

  cTFTotalTextureFormats = 22,

  // Old enums for compatibility with code compiled against previous versions
  cTFETC1 = cTFETC1_RGB,
  cTFETC2 = cTFETC2_RGBA,
  cTFBC1 = cTFBC1_RGB,
  cTFBC3 = cTFBC3_RGBA,
  cTFBC4 = cTFBC4_R,
  cTFBC5 = cTFBC5_RG,

  // Previously, the caller had some control over which BC7 mode the transcoder output. We've simplified this due to UASTC, which supports numerous modes.
  cTFBC7_M6_RGB = cTFBC7_RGBA,			// Opaque only, RGB or alpha if cDecodeFlagsTranscodeAlphaDataToOpaqueFormats flag is specified. Highest quality of all the non-ETC1 formats.
  cTFBC7_M5_RGBA = cTFBC7_RGBA,			// Opaque+alpha, alpha channel will be opaque for opaque .basis files
  cTFBC7_M6_OPAQUE_ONLY = cTFBC7_RGBA,
  cTFBC7_M5 = cTFBC7_RGBA,
  cTFBC7_ALT = 7,

  cTFASTC_4x4 = cTFASTC_4x4_RGBA,

  cTFATC_RGBA_INTERPOLATED_ALPHA = cTFATC_RGBA
}


declare class BasisFile {
  constructor(data: Uint8Array);
  close: () => void;
  getHasAlpha: () => void;
  getNumImages: () => number;
  getNumLevels: (image_index: number) => number;
  getImageWidth: (image_index: number, level_index: number) => number;
  getImageHeight: (image_index: number, level_index: number) => number;
  getFileDesc: () => BasisFileDesc;
  getImageDesc: (image_index: number) => BasisImageDesc;
  getImageLevelDesc: (image_index: number, level_index: number) => BasisImageDesc;
  getImageTranscodedSizeInBytes: (image_index: number, level_index: number, format: transcoder_texture_format) => number;
  isUASTC: () => boolean;
  startTranscoding: () => number;
  transcodeImage: (dst: Uint8Array, image_index: number, level_index: number, format: transcoder_texture_format, unused: number, get_alpha_for_opaque_formats: number) => number;
}

declare class KTX2File {
  private m_magic: number;
  private is_valid: boolean;
  constructor(data: Uint8Array);
  isValid: () => boolean;
  close: () => void;
  getDFDSize: () => number;
  getDFD: (dst: Uint8Array) => number;
  getHeader: () => KTX2Header;
  hasKey: (key_name: string) => boolean;
  getTotalKeys: () => number;
  getKey: (index: number) => string;
  getKeyValueSize: (key_name: string) => number;
  getKeyValue: (key_name: string, dst: Uint8Array) => number;
  getWidth: () => number;
  getHeight: () => number;
  getFaces: () => number;
  getLayers: () => number;
  getLevels: () => number;
  getFormat: () => number;
  isUASTC: () => boolean;
  isETC1S: () => boolean;
  getHasAlpha: () => boolean;
  getDFDColorModel: () => number;
  getDFDColorPrimaries: () => number;
  getDFDTransferFunc: () => number;
  getDFDFlags: () => number;
  getDFDTotalSamples: () => number;
  getDFDChannelID0: () => number;
  getDFDChannelID1: () => number;
  isVideo: () => boolean;
  getETC1SImageDescImageFlags: (level_index: number, layer_index: number, face_index: number) => number;
  getImageLevelInfo: (level_index: number, layer_index: number, face_index: number) => KTX2ImageLevelInfo;
  getImageTranscodedSizeInBytes: (level_index: number, layer_index: number, face_index: number, format: transcoder_texture_format) => number;
  startTranscoding: () => number;
  transcodeImage: (dst: Uint8Array, level_index: number, layer_index: number, face_index: number, format: transcoder_texture_format, get_alpha_for_opaque_formats: number, channel0: number, channel1: number) => number;
}

interface KTX2Header {
  vkFormat: number
  typeSize: number
  pixelWidth: number
  pixelHeight: number
  pixelDepth: number
  layerCount: number
  faceCount: number
  levelCount: number
  supercompressionScheme: number
  dfdByteOffset: number
  dfdByteLength: number
  kvdByteOffset: number
  kvdByteLength: number
  sgdByteOffset: number
  sgdByteLength: number
}

interface KTX2ImageLevelInfo {
  levelIndex: number;
  layerIndex: number;
  faceIndex: number;
  origWidth: number;
  origHeight: number;
  width: number;
  height: number;
  numBlocksX: number;
  numBlocksY: number;
  totalBlocksalphaFlag: boolean;
  iframeFlag: boolean;
}

interface BasisFileDesc {
  version: number,
  usPerFrame: number,
  totalImages: number,
  userdata0: number,
  userdata1: number,
  texFormat: basis_tex_format,
  yFlipped: boolean,
  hasAlphaSlices: boolean,
  // ETC1S endpoint codebook
  numEndpoints: number,
  endpointPaletteOfs: number,
  endpointPaletteLen: number,
  // ETC1S selector codebook
  numSelectors: number,
  selectorPaletteOfs: number,
  selectorPaletteLen: number,
  // Huffman codelength tables	
  tablesOfs: number,
  tablesLen: number
}

interface BasisImageDesc {
  origWidth: number;
  origHeight: number;
  numBlocksX: number;
  numBlocksY: number;
  numLevels: number;

  // Will be true if the image has alpha (for UASTC this may vary per-image)
  alphaFlag: boolean;
  iframeFlag: boolean;
}

interface BasisImageLevelDesc {
  // File offset/length of the compressed ETC1S or UASTC texture data.
  rgbFileOfs: number;
  rgbFileLen: number;

  // Optional alpha data file offset/length - will be 0's for UASTC or opaque ETC1S files.	
  alphaFileOfs: number;
  alphaFileLen: number;
}

interface BASISUModule extends EmscriptenModule {
  KTX2_VK_FORMAT_UNDEFINED: number;
  KTX2_KDF_DF_MODEL_UASTC: number;
  KTX2_KDF_DF_MODEL_ETC1S: number;
  KTX2_IMAGE_IS_P_FRAME: number;
  KTX2_UASTC_BLOCK_SIZE: number;
  KTX2_MAX_SUPPORTED_LEVEL_COUNT: number;

  KTX2_KHR_DF_TRANSFER_LINEAR: number;
  KTX2_KHR_DF_TRANSFER_SRGB: number;

  BasisFile: BasisFile;
  KTX2File: KTX2File;
  basis_tex_format: basis_tex_format;
  ktx2_supercompression: ktx2_supercompression;
  ktx2_df_channel_id: ktx2_df_channel_id;
  ktx2_df_color_primaries: ktx2_df_color_primaries;
}

declare class BasisEncoder {
  constructor();
  encode: (dst_basis_file_js_val: Uint8Array) => number;
  setSliceSourceImage: (slice_index: number, src_image_js_val: Uint8Array, width: number, height: number, src_image_is_png: boolean) => boolean;
  setUASTC: (uastc_flag: boolean) => void;
  setYFlip: (y_flip_flag: boolean) => void;
  setDebug: (debug_flag: boolean) => void;
  setPerceptual: (check_for_alpha_flag: boolean) => void;
  setCheckForAlpha: (check_for_alpha_flag: boolean) => void;
  setForceAlpha: (force_alpha_flag: boolean) => void;
  setSwizzle: (r: number, g: number, b: number, a: number) => void;
  setRenormalize: (r: number, g: number, b: number, a: number) => void;
  setMaxEndpointClusters: (max_endpoint_clusters: number) => void;
  setMaxSelectorClusters: (max_selector_clusters: number) => void;
  setQualityLevel: (quality_level: number) => void;
  setCompressionLevel: (comp_level: number) => void;
  setNormalMap: () => void;
  setSelectorRDOThresh: (selector_rdo_thresh: number) => void;
  setEndpointRDOThresh: (endpoint_rdo_thresh: number) => void;
  setCreateKTX2File: (create_ktx2_file: boolean) => void;
  setKTX2UASTCSupercompression: (use_zstandard: boolean) => void;
  setKTX2SRGBTransferFunc: (srgb_transfer_func: boolean) => void;
  setMipGen: (mip_gen_flag: boolean) => void;
  setMipScale: (mip_scale: boolean) => void;
  setMipFilter: (mip_filter: number) => void;
  setMipSRGB: (mip_srgb_flag: boolean) => void;
  setMipRenormalize: (mip_renormalize_flag: boolean) => void;
  setMipWrapping: (mip_wrapping_flag: boolean) => void;
  setMipSmallestDimension: (mip_smallest_dimension: number) => void;
  setTexType: (mip_smallest_dimension: basis_texture_type) => void;
  setUserData0: (userdata0: number) => void;
  setUserData1: (uint32_t: number) => void;
  setPackUASTCFlags: (pack_uastc_flags: number) => void;
}

interface BasisEncoderModule extends BASISUModule {
  initializeBasis:()=>void;
  BasisEncoder: BasisEncoder;
  BASISU_MAX_SUPPORTED_TEXTURE_DIMENSION: number;
  BASISU_DEFAULT_ENDPOINT_RDO_THRESH: number;
  BASISU_DEFAULT_SELECTOR_RDO_THRESH: number;
  BASISU_DEFAULT_QUALITY: number;
  BASISU_DEFAULT_HYBRID_SEL_CB_QUALITY_THRESH: number;
  BASISU_MAX_IMAGE_DIMENSION: number;
  BASISU_QUALITY_MIN: number;
  BASISU_QUALITY_MAX: number;
  BASISU_MAX_ENDPOINT_CLUSTERS: number;
  BASISU_MAX_SELECTOR_CLUSTERS: number;
  BASISU_MAX_SLICES: number;
  BASISU_RDO_UASTC_DICT_SIZE_DEFAULT: number;
  BASISU_RDO_UASTC_DICT_SIZE_MIN: number;
  BASISU_RDO_UASTC_DICT_SIZE_MAX: number;
  BASISU_MAX_RESAMPLER_FILTERS: number;
  BASISU_DEFAULT_COMPRESSION_LEVEL: number;
  BASISU_MAX_COMPRESSION_LEVEL: number;

  UASTC_RDO_DEFAULT_MAX_ALLOWED_RMS_INCREASE_RATIO: number;
  UASTC_RDO_DEFAULT_SKIP_BLOCK_RMS_THRESH: number;
}

interface BasisTranscoderModule extends BASISUModule {
  initializeBasis:()=>void;
  LowLevelETC1SImageTranscoder: LowLevelETC1SImageTranscoder;
  BASISU_MAX_SUPPORTED_TEXTURE_DIMENSION: number;
  BASISU_DEFAULT_ENDPOINT_RDO_THRESH: number;
  BASISU_DEFAULT_SELECTOR_RDO_THRESH: number;
  BASISU_DEFAULT_QUALITY: number;
  BASISU_DEFAULT_HYBRID_SEL_CB_QUALITY_THRESH: number;
  BASISU_MAX_IMAGE_DIMENSION: number;
  BASISU_QUALITY_MIN: number;
  BASISU_QUALITY_MAX: number;
  BASISU_MAX_ENDPOINT_CLUSTERS: number;
  BASISU_MAX_SELECTOR_CLUSTERS: number;
  BASISU_MAX_SLICES: number;
  BASISU_RDO_UASTC_DICT_SIZE_DEFAULT: number;
  BASISU_RDO_UASTC_DICT_SIZE_MIN: number;
  BASISU_RDO_UASTC_DICT_SIZE_MAX: number;
  BASISU_MAX_RESAMPLER_FILTERS: number;
  BASISU_DEFAULT_COMPRESSION_LEVEL: number;
  BASISU_MAX_COMPRESSION_LEVEL: number;

  UASTC_RDO_DEFAULT_MAX_ALLOWED_RMS_INCREASE_RATIO: number;
  UASTC_RDO_DEFAULT_SKIP_BLOCK_RMS_THRESH: number;
}

class LowLevelETC1SImageTranscoder{

} 

declare function BASIS(): BasisEncoderModule;