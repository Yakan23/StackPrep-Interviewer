import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};



export const MAX_FILE_SIZE = 1024 * 1024 * 5;
export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_RESUME_MIME_TYPES = "application/pdf"



export const authFormSchema =(type:FormType)=> z.object({
    username: type==="sign-up"? z.string().min(2, {
        message:"Username must be at least 2 characters"
    }).max(20, {
        message:"Username must be at most 20 characters."
    }): z.string().optional(),

    // profileImage: z
    //     .any()
    //     .refine((images) => {
    //         return images?.[0]?.size <= MAX_FILE_SIZE
    //     }, "Max image size is 5MB.")
    //     .refine((images) =>{
    //         return ACCEPTED_IMAGE_MIME_TYPES.includes(images?.[0]?.types)
    //     },"Only .jpg, .jpeg, .png and .webp formats are supported."),
    
    // resumeFile: z
    //     .any()
    //     .refine((files) => {
    //         return files?.[0]?.size <= MAX_FILE_SIZE
    //     }, "Max image size is 5MB.")
    //     .refine((files) => {
    //         return ACCEPTED_RESUME_MIME_TYPES.includes(files?.[0]?.types)
    //     }, "Only .pdf format is supported."),
    
    email: z.string().email(),
    password: z.string().min(8, {
        message:"Password must be at least 8 characters."
    }).max(25, {
        message:"Password must be at least 25 characters."
    }),
})