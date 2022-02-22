import { hexToBytes } from 'micro-stacks/common';

export const privateKeys = [
  'ba82a22eb5bad6b2e0558d919905fde0c139e67bcc5e8c2339f29cff6604f4ec',
  'be7ad417ee4216ab11fecf00bf6febbbe4014fc0b3e0b69762f8b40cd68278a9',
  'aff2f9f48d37a48839852729aea7e9c464ad778eaf35062b1882603bde99ada7',
  '6e6f35a00fa9f11fe94e15424da9ab1e4a5a82079ce5c1faff27e9a3f36464d8',
  'ac78fbe875983a8ec67c71e2a7a441bd0914c76b4ad66731eb9f398e810af04c',
];

export const publicKeys = [
  '03edf5ed04204ac5ab55832bb893958123f123e45fa417cfe950e4ece67359ee58',
  '02f8bb63e1e52f6dd145628849ec593d74dfe04b131604d1e5f5f134677fb31e72',
  '03577a3fafdde9ff55a934ef2b6e0b44afac817c05b73475d729517a1950a69fad',
  '03fa1f4df7c0d2aa9177cccde34eb61f5146431f74dfa7ea2299c52d782a1082d1',
  '02bb07a2f5faec4a972cd637f32e2c3f3815c9590d40d746ca756a50cea07cd617',
].map(k => hexToBytes(k));

export const [publicKey] = publicKeys;
export const [privateKey] = privateKeys;
