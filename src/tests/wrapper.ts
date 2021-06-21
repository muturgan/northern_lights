// @ts-ignore
import metatests = require('metatests');

const defaultOptions: metatests.ImperativeTestOptions = {} as any;
export const test = (caption: string, testFunc: (t: metatests.ImperativeTest) => void): void => {
   metatests.test(caption, testFunc, defaultOptions);
};
