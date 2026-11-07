// How customers can get their food: pickup, the kitchen's own delivery, and delivery partners.
// One place, so the website text, FAQ, structured data and llms.txt always agree.

export type OrderingInfo = {
  deliveryEnabled: boolean; // the kitchen delivers itself
  delivery: { doordash: string; ubereats: string };
};

export type PartnerKey = "doordash" | "ubereats";

export function deliveryPartners(s: OrderingInfo) {
  return [
    { key: "doordash" as PartnerKey, label: "DoorDash", href: s.delivery.doordash },
    { key: "ubereats" as PartnerKey, label: "Uber Eats", href: s.delivery.ubereats },
  ].filter((p) => p.href);
}

export function offersDelivery(s: OrderingInfo) {
  return s.deliveryEnabled || deliveryPartners(s).length > 0;
}

/** "DoorDash & Uber Eats" / "DoorDash" / "" */
export function partnerNames(s: OrderingInfo) {
  return deliveryPartners(s)
    .map((p) => p.label)
    .join(" & ");
}

/** Short label: "Pickup · Delivery on DoorDash & Uber Eats", "Pickup & delivery" or "Pickup only". */
export function fulfillmentLabel(s: OrderingInfo) {
  const names = partnerNames(s);
  if (names) return `Pickup · Delivery on ${names}`;
  return s.deliveryEnabled ? "Pickup & delivery" : "Pickup only";
}

/** One sentence for the FAQ / llms.txt. */
export function deliverySentence(s: OrderingInfo, phone: string) {
  const names = partnerNames(s);
  if (names && s.deliveryEnabled) return `Yes. We deliver ourselves (call ${phone}), and you can also order delivery on ${names}.`;
  if (names) return `Yes. You can order delivery on ${names}, or call ${phone} to order for pickup.`;
  if (s.deliveryEnabled) return `Yes, we offer pickup and delivery. Call ${phone} to order.`;
  return `Not right now. We're pickup only. Call ${phone} to order and we'll have your food ready when you arrive.`;
}
