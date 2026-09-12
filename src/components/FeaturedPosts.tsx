import React from "react";
import { getFeaturedPosts, getAllPosts } from "@/src/service/posts";
import ProjectsClientWrapper from "./ProjectsClientWrapper";

export default async function FeaturedPosts() {
  const featuredPosts = await getFeaturedPosts();
  const allPosts = await getAllPosts();

  return <ProjectsClientWrapper featuredPosts={featuredPosts} allPosts={allPosts} />;
}
