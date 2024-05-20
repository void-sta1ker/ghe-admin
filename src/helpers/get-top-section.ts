import { compose, split, tail, take } from "ramda";

// "/list-of-acts/9382" -> ["list-of-acts"]
type getUrlFragmentFn = (str: string) => string[];
// getTopSection :: string -> [string] -> [string] -> [string]
const getTopSection = compose(take(1), tail, split("/")) as getUrlFragmentFn;

export default getTopSection;
