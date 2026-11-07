// The owner's family photos (optimized copies in public/images/family; originals in photo-library/family).
// Alt text describes the moment without naming anyone.

export type FamilyPhoto = { src: string; alt: string; caption: string; w: number; h: number };

const f = (name: string, alt: string, caption: string, w = 1050, h = 1400): FamilyPhoto => ({
  src: `/images/family/${name}.webp`,
  alt,
  caption,
  w,
  h,
});

export const FAMILY_PHOTOS: FamilyPhoto[] = [
  f("better-together", "Two family members smiling in front of a neon “Better Together” sign", "Better together"),
  f("family-night-out", "A mom and her son posing together on a family night out", "Family night out"),
  f("graduation-day", "The family celebrating a high school graduation", "Graduation day", 880, 1400),
  f("siblings-welcome-the-baby", "Big brothers and sister welcoming a newborn baby with a cake", "Welcoming the baby", 1259, 1400),
  f("sisters-on-the-porch", "Two little sisters in matching pink outfits on the porch", "Sisters"),
  f("birthday-girl", "A smiling little girl in a birthday tutu and tiara", "Birthday girl"),
  f("family-celebration-smiles", "A smiling young man holding his little sister at a celebration", "All smiles"),
  f("family-selfie", "A family selfie, everyone laughing", "Us"),
  f("family-portrait-outdoors", "A young woman smiling outdoors", "Proud moments", 580, 625),
  f("throwback-family-photo", "An old family photo of a mother with two young children", "Where it all started", 882, 1400),
];

/** The rotating photos shown in the owner's arched frame until she uploads a portrait. */
export const SLIDESHOW = ["better-together", "family-night-out", "graduation-day", "siblings-welcome-the-baby", "family-selfie", "sisters-on-the-porch"]
  .map((n) => FAMILY_PHOTOS.find((p) => p.src.includes(`/${n}.webp`))!)
  .filter(Boolean);

export const OWNER_FOOD_PHOTO = f("homemade-tostadas-from-her-kitchen", "Homemade tostadas with cheese, sour cream and jalapeños, cooked by the owner", "Straight from my kitchen");
