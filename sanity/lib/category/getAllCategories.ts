import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllCategories = async () => {
  const ALL_CATEGORY_QUERY = defineQuery(`
 *[
    _type == "category"
 ]  | order(title asc)  
        `);

  try {
    const posts = await sanityFetch({ query: ALL_CATEGORY_QUERY });
    // console.log(posts, "Post DB. Data Items");
    return posts.data || [];
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
};
