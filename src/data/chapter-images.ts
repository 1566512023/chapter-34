/**
 * Photographs supplied by Phindile, mapped to the chapter item they belong to.
 * Key format: `${chapterId}::${itemId}`.
 */
import birthdays from "@/assets/up-birthdays.jpg.asset.json";
import businessOwner from "@/assets/up-business_owner.jpg.asset.json";
import currentPic from "@/assets/up-current_pic.jpg.asset.json";
import graduationFamily from "@/assets/up-family.jpg.asset.json";
import familyCollage from "@/assets/up-family.png.asset.json";
import sisterPortrait from "@/assets/up-family_2.jpg.asset.json";
import graduationTrio from "@/assets/up-family_2b.jpg.asset.json";
import foundationGranny from "@/assets/up-foundation_of_who_she_is.jpg.asset.json";
import god from "@/assets/up-god.jpg.asset.json";
import granny from "@/assets/up-granny_1.png.asset.json";

export const CHAPTER_IMAGES: Record<string, { url: string; alt: string }> = {
  "garden::granny": { url: granny.url, alt: "Phindile with her granny on graduation day" },
  "garden::sister": { url: sisterPortrait.url, alt: "Phindile's sister" },
  "foundation::god": { url: god.url, alt: "Phindile wearing her cross necklace" },
  "foundation::family": { url: familyCollage.url, alt: "A collage of family moments" },
  "foundation::legacy": { url: foundationGranny.url, alt: "Granny, the foundation of who she is" },
  "woman::faith": { url: god.url, alt: "Phindile, a woman of faith" },
  "woman::owner": { url: businessOwner.url, alt: "Phindile outside court as a business owner" },
  "woman::sister": { url: graduationTrio.url, alt: "Phindile with her sister and granny at graduation" },
  "little-hands::birthdays": { url: birthdays.url, alt: "Zane's first birthday celebration" },
  "thus-far::s4": { url: graduationFamily.url, alt: "Graduation day with family" },
  "thus-far::s7": { url: currentPic.url, alt: "Phindile today" },
};

export function chapterImage(chapterId: string, itemId: string) {
  return CHAPTER_IMAGES[`${chapterId}::${itemId}`];
}
