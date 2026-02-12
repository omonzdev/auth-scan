import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllContestants = async () => {
  const ALL_POST_QUERY = defineQuery(`
 *[
    _type == "contestant"
 ]  | order(name asc)  
        `);

  try {
    const posts = await sanityFetch({ query: ALL_POST_QUERY });
    // console.log(posts, "Post DB. Data Items");
    return posts.data || [];
  } catch (error) {
    console.error("Error fetching all contests:", error);
    return [];
  }
};
